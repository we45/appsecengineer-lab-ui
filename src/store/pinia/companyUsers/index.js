import { Notify, date as dateObj } from 'quasar'
import { convertDateFormate, timeSince, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { api, apiAnalytics, apiMacroMeta, apiGenerateSecret, apiCertifications } from 'src/boot/axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { negativeNotify, positiveNotify } from 'src/utils/notify'

export const useCompanyConsumerStore = defineStore('companyConsumer', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const normalUsers = ref([])
  const allUsers = ref([])
  const normalUsersOption = ref([])
  const allUsersOption = ref([])
  const adminUsers = ref([])
  const userAnalyticInfo = ref({})
  const userActiveCourses = ref([])
  const userCompletedCourses = ref([])
  const inActiveUsers = ref([])
  const inActiveAllUsers = ref([])
  const normalUserPagination = ref({})
  const allUserPagination = ref({})
  const adminUsersPagination = ref({})
  const optionAdminActiveUsers = ref([])
  const companyInfo = ref({})
  const analyticsInfo = ref({
    userUsedMinutes: 0
  })
  const statusOfUserAPI = ref(false)
  const statusOfUserAPIFile = ref(false)
  const recentActivitiesData = ref([])
  const errorCompanyUser = ref({
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    email: false,
    email_msg: ''
  })
  const errorCompanyUserFile = ref({
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    email: false,
    email_msg: ''
  })
  const fetchAllUsersInfo = ref([])
  const fetchAllUsersInfoWeekly = ref([])
  const fetchAllUsersInfoMonthly = ref([])
  const fetchIndividualUserInfoWeekly = ref([])
  const fetchIndividualUserInfoMonthly = ref([])
  const downloadXLSReport = ref([])
  const fetchIndividualUsersInfo = ref({
    courses: [],
    data: []
  })
  const errorMsgsReportIndividualUser = ref({ status: false, status_msg: '' })
  const errorMsgsReportIndividualUserOverall = ref({ status: false, status_msg: '' })
  const errorMsgsReportCompanyUser = ref({ status: false, status_msg: '' })
  const errorMsgsReportCompanyUserOverall = ref({ status: false, status_msg: '' })
  const companyUserCustomFields = ref({ c_attrs: [], defaults: {} })
  const errorCompanyUserCustomFields = ref({ status: false, status_msg: '' })
  const statusOfUserAPIFileData = ref({})
  const errorMsgsCompanyUsers = ref({})
  const corporateAdminCerts = ref([])

  function updateCustomUserField(payload) {
    const searchIndex = normalUsers.value
      .map(function (e) {
        return e.email
      })
      .indexOf(payload.email)
    const listFinal = normalUsers.value
    const updateObj = listFinal[searchIndex]
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'email') {
        updateObj[key] = value
      }
    })
    listFinal[searchIndex] = updateObj
    normalUsers.value = listFinal
  }

  function toggleIsActiveStatus(payload) {
    const searchIndex = normalUsers.value
      .map(function (e) {
        return e.email
      })
      .indexOf(payload.email)
    const listFinal = normalUsers.value
    const updateObj = listFinal[searchIndex]
    updateObj.isActive = payload.status
    listFinal[searchIndex] = updateObj
    normalUsers.value = listFinal
  }

  function assignToObject(stateRef, value) {
    stateRef = Object.assign(stateRef, value)
  }

  function mapAndPush(stateRef, value) {
    value.map((item) => stateRef.push(item))
  }
  function errorMsgReset(data) {
    errorCompanyUser.value = data
  }
  function errorMsgResetCustomFields(data) {
    errorCompanyUserCustomFields.value = data
  }

  async function manageLoading(callback, errCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      return errCallback ? await errCallback(error) : undefined
    } finally {
      isLoading.value = false
    }
  }

  function generateSecretToken(payload) {
    return manageLoading(
      async () => {
        const response = await apiGenerateSecret.post('secret', payload)
        return response.data.data
      },
      (err) => false
    )
  }

  function subscriptionInfo() {
    return manageLoading(
      async () => {
        const res = await api.get('chargebee/plans')
        return res.data
      },
      (err) => err
    )
  }

  function checkPlansInfo() {
    return manageLoading(
      async () => {
        const res = await api.get('chargebee/subscriptions')
        return res.data
      },
      (err) => err
    )
  }

  function generateUserList(
    items,
    { checkCustomFields, optionList, adminCheck } = { checkCustomFields: false, optionList: true, adminCheck: false }
  ) {
    const userList = []
    const userListOption = []
    const inactiveUsers = []
    items.forEach((user) => {
      if (adminCheck && !user.is_company_admin) return
      user.is_active && inactiveUsers.push(user.email)
      const customFieldsJson = {}
      checkCustomFields &&
        Object.entries(user).forEach(([key, value]) => {
          if (!['first_name', 'last_name', 'email', 'is_active', 'resend', 'full_name'].includes(key)) {
            customFieldsJson[key] = value
          }
        })
      userList.push({
        ...customFieldsJson,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        isActive: user.is_active,
        fullName: user.full_name,
        option: [{ value: user.email, label: '' }],
        resend: user.resend
      })
      optionList &&
        userListOption.push({
          value: user.email,
          label: user.first_name.toString() + ' ' + `(${user.email})`
        })
    })
    return { userList, userListOption, inactiveUsers }
  }

  function fetchCompanyNormalUsers(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/users-list', payload)
        if (res.data.success) {
          const { userList, inactiveUsers, userListOption } = generateUserList(res.data.data.Items, {
            checkCustomFields: true
          })
          normalUsers.value = userList
          normalUserPagination.value = res.data.data.LastEvaluatedKey ?? ''
          normalUsersOption.value = userListOption
          inActiveUsers.value = inactiveUsers
        }
      },
      (err) => {
        isError.value = err
      }
    )
  }

  function recentActivities(payload) {
    return manageLoading(async () => {
      recentActivitiesData.value = []
      const res = await api.post('user/course-actvity', payload)
      if (res.data) {
        const ra = []
        Object.entries(res.data.data).forEach(([key, value]) => {
          const dt = new Date(key)
          const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
          const date = timeSince(udt)
          let icon = ''
          let url = ''
          if (value.source_type) {
            if (value.source_type.includes('lab') || false) {
              icon = 'fas fa-flask'
              if (value.event_id && value.item_id && value.subject_id) {
                url = `/portal/course-info/lab/${urlSafeBase64Encode(value.event_id)}/${urlSafeBase64Encode(
                  value.subject_id
                )}/${urlSafeBase64Encode(value.item_id)}`
              }
            } else if (value.source_type.includes('vid') || false) {
              icon = 'fas fa-video'
              if (value.event_id && value.item_id && value.subject_id) {
                url = `/portal/course-info/video/${urlSafeBase64Encode(value.event_id)}/${urlSafeBase64Encode(
                  value.subject_id
                )}/${urlSafeBase64Encode(value.item_id)}`
              }
            } else if (value.source_type.includes('quiz') || false) {
              icon = 'fas fa-question'
              if (value.event_id && value.item_id && value.subject_id) {
                url = `/portal/course-info/quiz/${urlSafeBase64Encode(value.event_id)}/${urlSafeBase64Encode(
                  value.subject_id
                )}/${urlSafeBase64Encode(value.item_id)}`
              }
            } else if (value.source_type.includes('media') || false) {
              icon = 'fas fa-photo-video'
              if (value.event_id && value.item_id && value.subject_id) {
                url = `/portal/course-info/media/${urlSafeBase64Encode(value.event_id)}/${urlSafeBase64Encode(
                  value.subject_id
                )}/${urlSafeBase64Encode(value.item_id)}`
              }
            } else if (value.source_type.includes('download') || false) {
              icon = 'fas fa-download'
            } else {
              url = `/portal/course-info/intro/${urlSafeBase64Encode(value.event_id)}`
              icon = ''
            }
          }
          ra.push({
            date: date,
            name: value.name,
            icon: icon,
            action: value.action,
            type: value.source_type,
            url: url
          })
        })
        recentActivitiesData.value = ra
        return ra
      }
    })
  }

  function fetchCompanyAllUsers(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/users-list', payload)
        if (res.data.success) {
          const { inactiveUsers, userList, userListOption } = generateUserList(res.data.data.Items)
          allUsers.value = userList
          allUserPagination.value = res.data.data.LastEvaluatedKey ?? {}
          allUsersOption.value = userListOption
          inActiveAllUsers.value = inActiveUsers
        }
      },
      (err) => {
        isError.value = err
      }
    )
  }

  function fetchPaginatedCompanyAllUsers(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/users-list', payload)
        if (res.data.success) {
          const userList = []
          const userListOption = []
          const inActiveUsers = []
          const {} = generateUserList(res.data.data.Items)
          mapAndPush(allUsers.value, userList)
          allUserPagination.value = res.data.data.LastEvaluatedKey ?? {}
          mapAndPush(allUsersOption.value, userListOption)
          mapAndPush(inActiveAllUsers.value, inActiveUsers)
        }
      },
      (err) => (isError.value = err)
    )
  }

  function searchCompanyNormalUser(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/search-user', payload)
        if (res.data.success) {
          const { inactiveUsers, userList, userListOption } = generateUserList(res.data.data.data)
          normalUsers.value = userList
          normalUserPagination.value = res.data.data.LastEvaluatedKey ?? ''
          normalUsersOption.value = userListOption
          inActiveUsers.value = inactiveUsers
        }
      },
      (err) => {
        isError.value = err
      }
    )
  }

  function fetchPaginatedCompanyNormalUsers(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/users-list', payload)
        if (res.data.success) {
          const { inactiveUsers, userList, userListOption } = generateUserList(res.data.data.Items)
          mapAndPush(normalUsers.value, userList)
          normalUserPagination.value = res.data.data.LastEvaluatedKey ?? ''
          normalUserPagination.value = userListOption
          inActiveUsers.value = inactiveUsers
        }
      },
      (err) => {
        isError.value = err
      }
    )
  }

  function fetchCompanyAdminUsers(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/list-admin-user', payload)
        if (res.data.success) {
          const { userList, inactiveUsers } = generateUserList(res.data.data.Items, { optionList: false })
          adminUsers.value = userList
          adminUsersPagination.value = res.data.data.LastEvaluatedKey ?? {}
          optionAdminActiveUsers.value = inactiveUsers
        }
      },
      (err) => {
        isError.value = err
      }
    )
  }

  function fetchPaginatedCompanyAdminUsers(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/list-admin-user', payload)
        if (res.data.success) {
          const { userList, inactiveUsers } = generateUserList(res.data.data.Items, {
            optionList: false,
            adminCheck: true
          })
          mapAndPush(adminUsers.value, userList)
          adminUsersPagination.value = res.data.data.LastE
          adminUsersPagination.value = res.data.data.LastEvaluatedKey ?? {}
          mapAndPush(optionAdminActiveUsers.value, inactiveUsers)
        }
      },
      (err) => (isError.value = err)
    )
  }

  function downloadXLSReportAction(payload) {
    return manageLoading(async () => {
      const error = { status: false, status_msg: '' }
      errorMsgsReportCompanyUserOverall.value = error
      assignToObject(errorMsgsReportCompanyUserOverall.value, error)
      const reportData = []
      let isUserListExists = 1
      while (isUserListExists >= 1) {
        try {
          const res = await api.post('company/user-stats', payload.users)
          if (res.data.success) {
            error.status = true
            assignToObject(errorMsgsReportCompanyUserOverall.value, error)
            res.data.data.items.forEach((info) => {
              const finalObj = {
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                'Course Name': info.course_name,
                'Total course Minutes': info.Actual_minutes.toString(),
                'Total completed Minutes': info.Total_minutes_spent.toString(),
                'Total Video Minutes': info?.Video_minutes?.toString(),
                'Total Lab Minutes': info?.Lab_minutes?.toString(),
                'Account status': info.account_status,
                Percentage: info['progress(%)'] === '' ? '0' : `${info['progress(%)']}`
              }
              const keyData = {}
              Object.entries(info).forEach(([key, value]) => {
                if (
                  ![
                    'email',
                    'first_name',
                    'last_name',
                    'course_name',
                    'Actual_minites',
                    'Total_minutes_spent',
                    'Video_minutes',
                    'Lab_minutes',
                    'account_Status',
                    'progress(%)'
                  ].includes(key)
                ) {
                  keyData[key] = value
                }
              })
              reportData.push({ ...finalObj, ...keyData })
            })
            isUserListExists += res.data.data.pagination ? 1 : 0
            if (res.data.data.pagination) {
              payload.users.pagination = res.data.data.pagination
            } else {
              payload.users = {}
            }
          }
        } catch (err) {
          assignToObject(errorMsgsReportCompanyUserOverall.value, error)
          isUserListExists = 0
          if (error.response.status === 400) {
            if (typeof error.response.data.message === 'string') {
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: 'please provide valid month'
              })
            } else {
              Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
            }
          } else {
            Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          }
        }
      }
      fetchAllUsersInfo.value = reportData
    })
  }
  function downloadXLSReportActionWeeklyMonthly(payload) {
    return manageLoading(async () => {
      const reportDataWeekly = []
      const reportDataMontly = []
      const error = { status: false, status_msg: '' }
      assignToObject(errorMsgsReportCompanyUser.value, error)
      let isUserListExists = 1
      while (isUserListExists >= 1) {
        try {
          const res = await api.post('company/monthly-report', payload.users)
          if (res.data.success) {
            error.status = true
            assignToObject(errorMsgsReportCompanyUser.value, error)
            res.data.data.items.monthly.forEach((info) => {
              reportDataMontly.push({
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                'Month/year': convertDateFormate(payload.users.select),
                'Enrolled Courses': info.enrolled_courses,
                'Total course Minutes': info.course_minutes.toString(),
                'Total Lab Minutes': info.lab_minutes.toString(),
                'Account status': info.account_status
              })
            })
            res.data.data.items.weekly.forEach((info) => {
              reportDataWeekly.push({
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                Date: convertDateFormate(info.week),
                'Total course Minutes': info.course_minutes.toString(),
                'Total Lab Minutes': info.lab_minutes.toString(),
                'Account status': info.account_status
              })
            })
            if (res.data.data.pagination) {
              payload.users.pagination = res.data.data.pagination
              isUserListExists += 1
            } else {
              isUserListExists = 0
              payload.users = {}
            }
          }
        } catch (err) {
          isUserListExists = 0
          error.status = false
          assignToObject(errorMsgsReportCompanyUser.value, error)
          if (error.response.status === 400) {
            if (typeof error.response.data.message === 'string') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
            } else {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'please provide valid month' })
            }
          } else {
            Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          }
        }
      }
      fetchAllUsersInfoWeekly.value = reportDataWeekly
      fetchAllUsersInfoMonthly.value = reportDataMontly
    })
  }
  function downloadXLSReportActionIndividual(payload) {
    return manageLoading(
      async () => {
        const reportData = []
        const coursesData = []
        const error = { status: false, status_msg: '' }
        assignToObject(errorMsgsReportIndividualUserOverall.value, error)
        const res = await api.post('user/user-stats', payload)
        if (res.data.success) {
          error.status = true
          assignToObject(errorMsgsReportIndividualUserOverall.value, error)
          Object.entries(res.data.data.Courses).forEach(([key, value]) => {
            coursesData.push({
              Email: payload.email,
              'Course Name': key,
              Progress: value
            })
          })
          res.data.data.stats.forEach((info) => {
            reportData.push({
              Email: info.email,
              'First Name': info.first_name,
              'Last Name': info.last_name,
              'Course Name': info.course_name,
              'Total course Minutes': info.Actual_minutes.toString(),
              'Total completed Minutes': info.Total_minutes_spent.toString(),
              'Total Video Minutes': info?.Video_minutes?.toString(),
              'Total Lab Minutes': info?.Lab_minutes?.toString(),
              Percentage: info['progress(%)'] === '' ? '0' : `${info['progress(%)']}`
            })
          })
          fetchIndividualUsersInfo.value = { courses: coursesData, data: reportData }
        }
      },
      (error) => {
        error.status = false
        assignToObject(errorMsgsReportIndividualUserOverall.value, error)
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    )
  }
  function downloadXLSReportActionIndividualUserWeeklyMonthly(payload) {
    return manageLoading(async () => {
      const reportDataWeekly = []
      const reportDataMontly = []
      const error = { status: false, status_msg: '' }
      assignToObject(errorMsgsReportIndividualUser.value, error)
      let isUserListExists = 1
      while (isUserListExists >= 1) {
        try {
          const res = await api.post('company-user/monthly-report', payload.users)
          if (res.data.success) {
            error.status = true
            assignToObject(errorMsgsReportIndividualUser.value, error)
            res.data.data.monthly.forEach((info) => {
              reportDataMontly.push({
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                'Month/year': convertDateFormate(payload.users.select),
                'Enrolled Courses': info.enrolled_courses,
                'Total course Minutes': info.course_minutes.toString(),
                'Total Lab Minutes': info.lab_minutes.toString()
              })
            })
            res.data.data.weekly.forEach((info) => {
              reportDataWeekly.push({
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                Date: convertDateFormate(info.week),
                'Total course Minutes': info.course_minutes.toString(),
                'Total Lab Minutes': info.lab_minutes.toString()
              })
            })
            if (res.data.data.pagination) {
              payload.users.pagination = res.data.data.pagination
              isUserListExists += 1
            } else {
              isUserListExists = 0
              payload.users = {}
            }
          }
        } catch (error) {
          isUserListExists = 0
          error.status = false
          assignToObject(errorMsgsReportIndividualUser.value, error)
          if (error.response.status === 400) {
            if (typeof error.response.data.message === 'string') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
            } else {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'please provide valid month' })
            }
          } else {
            Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          }
        }
      }
      fetchIndividualUserInfoWeekly.value = reportDataWeekly
      fetchIndividualUserInfoMonthly.value = reportDataMontly
    })
  }
  function createNewUser(payload) {
    return manageLoading(async () => {
      try {
        statusOfUserAPI.value = false
        assignToObject(errorCompanyUser.value, {
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: ''
        })
        const res = await api.post('company/create-user', payload)
        if (res.data.success) {
          statusOfUserAPI.value = true
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'User has been created successfully' })
          fetchCompanyNormalUsers({ all: false })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      } catch (error) {
        statusOfUserAPI.value = false
        isError.value = error
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          Object.entries(error.response.data.message).forEach(([key, value]) => {
            if (typeof error.response.data.message[key] === 'object') {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = error.response.data.message[key].toString()
            } else {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = value
            }
          })
          assignToObject(errorCompanyUser.value, err_msgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    })
  }
  function createCustomFields(payload) {
    return manageLoading(
      async () => {
        statusOfUserAPI.value = false
        assignToObject(errorCompanyUserCustomFields.value, { status: false, status_msg: '' })
        const res = await api.post('company/attrs/create', payload)
        if (res.data.success) {
          statusOfUserAPI.value = true
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Custom fields created successfully' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      },
      (error) => {
        statusOfUserAPI.value = false
        isError.value = error
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          Object.entries(error.response.data.message).forEach(([key, value]) => {
            if (typeof error.response.data.message[key] === 'object') {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = error.response.data.message[key].toString()
            } else {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = value
            }
          })
          errorCompanyUserCustomFields.value = err_msgs
          if (error.response.data.message) {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }
  function updateCustomFields(payload) {
    return manageLoading(
      async () => {
        statusOfUserAPI.value = false
        assignToObject(errorCompanyUserCustomFields.value, { status: false, status_msg: '' })
        const res = await api.post('company/attrs/update', payload)
        if (res.data.success) {
          statusOfUserAPI.value = true
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Custom attributes updated successfully' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      },
      (error) => {
        statusOfUserAPI.value = false
        isError.value = error
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          Object.entries(error.response.data.message).forEach(([key, value]) => {
            if (typeof error.response.data.message[key] === 'object') {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = error.response.data.message[key].toString()
            } else if (typeof error.response.data.message[key] === 'string') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: value })
            } else {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = value
            }
          })
          errorCompanyUserCustomFields.value = err_msgs
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }
  function createUsersByFile(payload) {
    return manageLoading(async () => {
      statusOfUserAPIFile.value = false
      statusOfUserAPIFileData.value = {}
      assignToObject(errorCompanyUserFile.value, {
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: '',
        email: false,
        email_msg: ''
      })
      const { fields, url } = await api.get('company/users/import').then((res) => res.data.data)

      const form = { ...fields, file: payload }
      form['Content-Type'] = payload.type

      await api
        .post(url, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => res.data)
        .catch((error) => console.warn(error))

      await api.get('company/users/import/status').then((res) => {})
    })
  }
  function disableCompanyUser(payload) {
    return manageLoading(async () => {
      try {
        const response = await api.post('company/disable-user', payload)
        if (response.data.success) {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: response.data.message
          })
        }
        return response.data
      } catch (error) {
        return false
      }
    })
  }
  function enableCompanyUser(payload) {
    return manageLoading(async () => {
      try {
        const response = await api.post('company/enable-user', payload)
        return response.data
      } catch (error) {
        if (error.response.data) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
        return false
      }
    })
  }
  function sendEmailForUserAction(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('comapany/user/resend', payload)
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Email sent successfully' })
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function createAdminUser(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/create-adminuser', payload)
        if (res.data.success) {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Administrator has been successfully created' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }

  function toggleAdmin(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/admin/toggle', payload)
        res.data.success ? positiveNotify('Admin status updated successfully') : negativeNotify('Failed to update admin status')
        return res.data.success
      },
      (error) => {
        isError.value = error
        negativeNotify(error.response?.data?.message ?? 'Failed to update admin status')
        return false
      }
    )
  }
  function fetchUserDashboardAnalytic(payload) {
    return manageLoading(
      async () => {
        userAnalyticInfo.value = null
        const res = await apiMacroMeta.post('user-report', payload)

        if (res.status === 200) {
          const userInfo = {
            activeCourses: res.data.total_enrolled,
            courseMinutes: res.data.total_course_minutes,
            badges: res.data.badges,
            completedLabs: res.data.labs_completed,
            completedChallenges: res.data.challenges_completed,
            completedVideos: res.data.videos_completed,
            dashboard: res.data.dashboard,
            monthLabMinutes: res.data.month_lab_minutes,
            totalLabMinutes: res.data.total_lab_minutes
          }
          userAnalyticInfo.value = userInfo
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function fetchUserActiveCourses(payload) {
    return manageLoading(
      async () => {
        userActiveCourses.value = []
        const res = await api.post('company/users-active-courses', payload)
        if (res.data.success) {
          const activeCourses = res.data.data.map((course) => ({
            name: course.event_name,
            id: course.sk,
            logo: course.logo
          }))
          userActiveCourses.value = activeCourses
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function fetchUserCompletedCourses(payload) {
    return manageLoading(
      async () => {
        userCompletedCourses.value = []
        const res = await api.post('company/users-completed-courses', payload)
        if (res.data.success) {
          const completedCourses = res.data.data.map((course) => ({
            name: course.event_name,
            id: course.sk,
            logo: course.logo
          }))
          userCompletedCourses.value = completedCourses
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function fetchCompanyInfo(payload) {
    return manageLoading(
      async () => {
        const res = await api.get('company/get')
        if (res.data.success) {
          const companyInfoData = {
            name: res.data.data.company_name,
            id: res.data.data.id,
            startDate: dateObj.formatDate(res.data.data.start_date, 'DD MMMM YYYY'),
            totalUsers: res.data.data.total_users,
            activeUsers: res.data.data.current_users,
            remainingUsers: res.data.data.remainig_users,
            priceId: res.data.data.plan ? res.data.data.plan.id : '',
            endDate: dateObj.formatDate(res.data.data.end_date, 'DD MMMM YYYY')
          }
          companyInfo.value = companyInfoData
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function fetchCompanyUserCustomFieldsData(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/attrs/get', payload)
        if (res.data.success) {
          companyUserCustomFields.value = { c_attrs: res.data.data.c_attrs || [], defaults: res.data.data.defaults || {} }
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function updateIndividualCompanyUserCustomFields(payload) {
    return manageLoading(
      async () => {
        assignToObject(errorCompanyUserCustomFields.value, { status: false, status_msg: '' })
        const res = await api.post('company/user/update', payload)
        if (res.data.success) {
          Notify.create({ type: 'positive', position: 'top', message: `${res.data.message}` })
          assignToObject(errorCompanyUserCustomFields.value, { status: true })
          updateCustomUserField(payload)
        }
      },
      (error) => {
        isError.value = error
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          Object.entries(error.response.data.message).forEach(([key, value]) => {
            if (typeof error.response.data.message[key] === 'object') {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = error.response.data.message[key].toString()
            } else {
              err_msgs[key] = true
              err_msgs[key + '_msg'] = value
            }
          })
          errorCompanyUserCustomFields.value = err_msgs
          if (error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }
  function deleteCompanyUserCustomFieldsData(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/attrs/delete', payload)
        if (res.data.success) {
          companyUserCustomFields.value = { c_attrs: [], defaults: {} }
        }
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Custom Attribute deleted successfully' })
      },
      (error) => {
        isError.value = error
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    )
  }
  function fetchDashboardAnalyticsInfo(payload) {
    return manageLoading(async () => {
      const res = apiAnalytics.post('company/user/stats-key', payload)
      if (res.data.success) {
        const stats = {
          userUsedMinutes: res.data.data.course_minutes | 0
        }
        analyticsInfo.value = stats
      }
    })
  }

  function fetchCorporateAdminCertificates() {
    return manageLoading(async () => {
      const res = await apiCertifications.get('certification/list-certs')
      if (res.status === 200) {
        corporateAdminCerts.value = res.data?.data ?? []
      }
    })
  }

  function issueCorporateCertificates(payload) {
    return manageLoading(async () => {
      const res = await apiCertifications.post('certification/issue-attempt', payload)
      Notify.create({
        type: res.data.error ? 'negative' : 'positive',
        position: 'top',
        progress: true,
        message: res.data.message
      })
    })
  }

  return {
    isLoading,
    isError,
    normalUsers,
    allUsers,
    normalUsersOption,
    allUsersOption,
    adminUsers,
    userAnalyticInfo,
    userActiveCourses,
    userCompletedCourses,
    inActiveUsers,
    inActiveAllUsers,
    normalUserPagination,
    allUserPagination,
    adminUsersPagination,
    optionAdminActiveUsers,
    companyInfo,
    analyticsInfo,
    statusOfUserAPI,
    statusOfUserAPIFile,
    recentActivitiesData,
    errorCompanyUser,
    errorCompanyUserFile,
    fetchAllUsersInfo,
    fetchAllUsersInfoWeekly,
    fetchAllUsersInfoMonthly,
    fetchIndividualUserInfoWeekly,
    fetchIndividualUserInfoMonthly,
    downloadXLSReport,
    fetchIndividualUsersInfo,
    errorMsgsReportIndividualUser,
    errorMsgsReportIndividualUserOverall,
    errorMsgsReportCompanyUser,
    errorMsgsReportCompanyUserOverall,
    companyUserCustomFields,
    errorCompanyUserCustomFields,
    statusOfUserAPIFileData,
    errorMsgsCompanyUsers,
    generateSecretToken,
    subscriptionInfo,
    checkPlansInfo,
    fetchCompanyNormalUsers,
    recentActivities,
    fetchCompanyAllUsers,
    fetchPaginatedCompanyAllUsers,
    searchCompanyNormalUser,
    fetchPaginatedCompanyNormalUsers,
    fetchCompanyAdminUsers,
    fetchPaginatedCompanyAdminUsers,
    downloadXLSReportAction,
    downloadXLSReportActionWeeklyMonthly,
    downloadXLSReportActionIndividual,
    downloadXLSReportActionIndividualUserWeeklyMonthly,
    createNewUser,
    createCustomFields,
    updateCustomFields,
    createUsersByFile,
    disableCompanyUser,
    enableCompanyUser,
    sendEmailForUserAction,
    errorMsgReset,
    errorMsgResetCustomFields,
    createAdminUser,
    toggleAdmin,
    fetchUserDashboardAnalytic,
    fetchUserActiveCourses,
    fetchUserCompletedCourses,
    fetchCompanyInfo,
    fetchCompanyUserCustomFieldsData,
    updateIndividualCompanyUserCustomFields,
    deleteCompanyUserCustomFieldsData,
    fetchDashboardAnalyticsInfo,
    fetchCorporateAdminCertificates,
    corporateAdminCerts,
    issueCorporateCertificates
  }
})
