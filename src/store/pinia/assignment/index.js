import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { Notify } from 'quasar'
import { api, apiTests, apiMacroMeta } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAssignmentCourse } from '../assignments/course'

export const useAssignmentStore = defineStore('assignment', () => {
  const isLoading = ref(false)
  const certificateStatusInfo = ref({})
  const assignmentList = ref([])
  const challengeAssignmentList = ref([])
  const loadedChallengeAssignmentType = ref()
  const statusOfUserAPI = ref(false)
  const usersListByAssignment = ref([])
  const assignmentUserList = ref([])
  const issuedCertificateInfo = ref([])
  const assignmentInfo = ref({})
  const assignmentTestsInfo = ref({})
  const paginatedTeams = ref({})
  const paginationAssignmentKeyForward = ref({})
  const paginatedUsers = ref({})
  const paginatedEvents = ref({})
  const statusOfAssignmentAPI = ref(false)
  const statusOfVerifyAPI = ref(false)
  const verificationOptions = ref([])
  const errorAssignment = ref({
    events: false,
    events_msg: '',
    is_active: false,
    is_active_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    users: false,
    users_msg: '',
    teams: false,
    teams_msg: '',
    name: false,
    name_msg: '',
    verify_completion: false,
    verify_completion_msg: ''
  })
  const errorCertificate = ref({
    duration_type: false,
    duration_type_msg: '',
    duration: false,
    duration_msg: '',
    description: false,
    description_msg: '',
    skills: false,
    skills_msg: ''
  })
  const errorVerification = ref({})
  const totalUsersList = ref([])
  const totalFilteredUsersList = ref([])
  const totalTeamUsersList = ref([])
  const paginatesListTeams = ref([])
  const fetchTeamInfoWeekly = ref([])
  const fetchTeamInfoMonthly = ref([])
  const skillsInfo = ref([])
  const paginatedAssignment = ref({})
  const paginatedChallengeAssignment = ref({})
  const paginatedUserAssignment = ref({})
  const errorMsgsReportTeam = ref({ status: false, status_msg: '' })
  const errorMsgsReportTeamOverall = ref({ status: false, status_msg: '' })
  const filterStateChallenge = ref({
    test_type: '',
    status: '',
    search_term: '',
    start_date: '',
    end_date: '',
    finalPayload: {},
    finalPayloadPlain: {}
  })
  const sectionPage = ref('Tests')
  const attachChallenge = ref([])
  const pageFilters = ref({
    test: null,
    interview: null
  })

  const courseAssignmentStore = useAssignmentCourse()

  function setStateChallenge(data) {
    filterStateChallenge.value = Object.assign(filterStateChallenge.value, data)
  }
  function setErrorMessageReportTeam(data) {
    errorMsgsReportTeam.value = Object.assign(errorMsgsReportTeam.value, data)
  }
  function setErrorMessageReportTeamOverAll(data) {
    errorMsgsReportTeamOverall.value = Object.assign(errorMsgsReportTeamOverall.value, data)
  }
  function setErrorAssignment(data) {
    errorAssignment.value = Object.assign(errorAssignment.value, data)
  }
  function setErrorCertificate(data) {
    errorCertificate.value = Object.assign(errorCertificate.value, data)
  }
  function updateTestsAssignmentInfo(data) {
    assignmentTestsInfo.value = data
  }
  function errorMsgResetVerification(data) {
    errorVerification.value = data
  }

  async function manageLoadingWithOptions(callback, errCallback = undefined, options = {}) {
    const { toggleLoading, toggleStatusOfAPI, handleNetworkError, handleBadRequest, payload } = {
      toggleStatusOfAPI: true,
      toggleLoading: true,
      handleNetworkError: true,
      handleBadRequest: true,
      payload: null,
      ...options
    }
    try {
      toggleLoading && (isLoading.value = true)
      toggleStatusOfAPI && (statusOfAssignmentAPI.value = false)
      const result = await callback()
      toggleStatusOfAPI && (result.data.success || result.data.Success) && (statusOfAssignmentAPI.value = true)
      return result
    } catch (error) {
      console.log(error)
      toggleStatusOfAPI && (statusOfAssignmentAPI.value = false)
      if (handleNetworkError && error.toString() === 'Error: Network Error') {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'Server busy please try later!'
        })
      }
      if (handleBadRequest && payload) {
        if (error.response?.status === 400) {
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
          setErrorAssignment(err_msgs)
          if (typeof error.response?.data?.message !== 'string') return
        }
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response?.data?.errors ? error.response?.data?.errors[0].msg : error.response?.data?.message
        })
      }
      errCallback ? errCallback(error) : undefined
    } finally {
      toggleLoading && (isLoading.value = false)
    }
  }

  async function manageLoading(callback, errCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      return errCallback ? errCallback(error) : undefined
    } finally {
      isLoading.value = false
    }
  }

  function createCompanyAssignment(payload) {
    return manageLoadingWithOptions(
      async () => {
        setErrorAssignment({
          events: false,
          events_msg: '',
          is_active: false,
          is_active_msg: '',
          start_date: false,
          start_date_msg: '',
          end_date: false,
          end_date_msg: '',
          users: false,
          users_msg: '',
          teams: false,
          teams_msg: '',
          name: false,
          name_msg: '',
          verify_completion: false,
          verify_completion_msg: ''
        })
        const res = await api.post('company/assign/create', payload)
        if (res.data.success) {
          courseAssignmentStore.fetchAssignmentCourse('created')
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: 'Assignment has been successfully created'
          })
        }
        return res
      },
      (error) => {},
      { payload }
    )
  }

  function createCompanyChallengeAssignment(payload) {
    return manageLoadingWithOptions(
      async () => {
        setErrorAssignment({
          events: false,
          events_msg: '',
          is_active: false,
          is_active_msg: '',
          start_date: false,
          start_date_msg: '',
          end_date: false,
          end_date_msg: '',
          users: false,
          users_msg: '',
          description: false,
          description_msg: '',
          teams: false,
          teams_msg: '',
          name: false,
          name_msg: '',
          verify_completion: false,
          verify_completion_msg: ''
        })
        attachChallenge.value = {}
        const res = await apiTests.post('test-assign/create', payload, { noLoading: true })
        if (res.data.success) {
          attachChallenge.value = res.data.data || {}
          challengeAssignmentList.value.push(
            {
              ...res.data.data,
              id: res.data?.data?.sk
            } ?? {}
          )
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: `${payload.test_type === 'test' ? 'Tournament' : 'Interview'} created successfully`
          })
        }
        return res
      },
      (error) => {
        return false
      },
      { payload }
    )
  }

  function updateCompanyChallengeAssignment(payload, oldIndex = null) {
    return manageLoadingWithOptions(
      async () => {
        setErrorAssignment({
          events: false,
          events_msg: '',
          is_active: false,
          is_active_msg: '',
          start_date: false,
          start_date_msg: '',
          end_date: false,
          end_date_msg: '',
          users: false,
          users_msg: '',
          description: false,
          description_msg: '',
          teams: false,
          teams_msg: '',
          name: false,
          name_msg: '',
          verify_completion: false,
          verify_completion_msg: ''
        })
        const res = await apiTests.post('test-assign/update', payload, { noLoading: true })
        if (res.data.success || res.data.Success) {
          const assignmentIndex = challengeAssignmentList.value.findIndex((assignment) => {
            return assignment?.id == payload?.test
          })
          const info = res.data?.data
          challengeAssignmentList.value[assignmentIndex] = {
            index: assignmentIndex,
            name: info.name.toString(),
            id: info.sk,
            events: info.events,
            active: info.active,
            users: info.users,
            description: info.description,
            end_date: info.end_date,
            duration: info.duration,
            start_date: info.start_date,
            delivery_id: info.delivery_id || '',
            status_assignment: info.status_assignment,
            pass_percentage: info.pass_percentage,
            teams: info?.teams ?? [],
            type: info.test_type
          }
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: 'Assignment has been successfully updated'
          })
        }
        return res
      },
      (error) => {},
      { payload }
    )
  }
  function assignCertificateSend(payload) {
    return manageLoadingWithOptions(
      async () => {
        certificateStatusInfo.value = {}
        errorVerification.value = {}
        const res = await api.post('company/assign/certificate/send', payload)

        if (res.data.success) {
          certificateStatusInfo.value = res.data.data
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: res.data.data?.message ?? 'Certificate initiation for issuance has been successfully triggered for each user.'
          })
        }
        return res
      },
      (error) => {
        certificateStatusInfo.value = {}
      },
      { payload }
    )
  }

  function createCompanyCertificate(payload) {
    return manageLoadingWithOptions(
      async () => {
        setErrorCertificate({
          duration_type: false,
          duration_type_msg: '',
          duration: false,
          duration_msg: '',
          description: false,
          description_msg: '',
          skills: false,
          skills_msg: ''
        })
        const res = await api.post('company/assign/certificate/create', payload)
        if (res.data.success) {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: 'Certificate has been successfully created'
          })
        }
        return res
      },
      (error) => {},
      { payload }
    )
  }

  function fetchCompanyAssignmentGet(payload) {
    return manageLoading(
      async () => {
        assignmentInfo.value = {}
        const res = await api.post('company/assign/get', payload)
        res.data.success && (assignmentInfo.value = res.data.data)
      },
      (error) => {
        assignmentInfo.value = false
      }
    )
  }

  function fetchIssuedCertificateInfo(payload) {
    return manageLoading(
      async () => {
        issuedCertificateInfo.value = []
      },
      () => {
        issuedCertificateInfo.value = []
      }
    )
  }

  function fetchVerificationOptions(payload) {
    return manageLoading(
      async () => {
        verificationOptions.value = []
        statusOfVerifyAPI.value = false
        const res = await api.post('company/assign/certificate/verify-design', payload)
        if (res.data.success) {
          statusOfVerifyAPI.value = true
          const optionsData = []
          Object.entries(res.data.data).forEach(([key, value]) => {
            optionsData.push({
              key: key,
              value: ''
            })
          })
          verificationOptions.value = optionsData
        }
      },
      (error) => {
        statusOfVerifyAPI.value = false
        verificationOptions.value = []
        if (typeof error.response.data.message === 'string') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }

  function fetchSkillsQueryData(payload) {
    return manageLoading(async () => {
      const res = await api.post('company/assign/certificate/skills', payload)
      skillsInfo.value = res.data.data || []
    })
  }

  function updateCompanyAssignment(payload) {
    return manageLoadingWithOptions(
      async () => {
        setErrorAssignment({
          events: false,
          events_msg: '',
          is_active: false,
          is_active_msg: '',
          start_date: false,
          start_date_msg: '',
          end_date: false,
          end_date_msg: '',
          users: false,
          users_msg: '',
          teams: false,
          teams_msg: '',
          name: false,
          name_msg: '',
          verify_completion: false,
          verify_completion_msg: ''
        })

        const res = await api.post('company/assign/update', payload)
        if (res.data.success) {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: 'Assignment has been successfully updated'
          })
          if (courseAssignmentStore.assignmentDetails?.excluded_users) {
            const excluded = res.data?.data?.item?.excluded_users ?? []
            courseAssignmentStore.assignmentDetails.excluded_users = excluded
          }
        } else {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: `${res.data.message}`
          })
        }
        return res
      },
      (error) => {},
      { payload }
    )
  }

  function deleteCompanyAssignment(payload) {
    return manageLoading(
      async () => {
        statusOfAssignmentAPI.value = false
        const res = await api.post('company/assign/delete', payload)
        if (res.data.success) {
          statusOfAssignmentAPI.value = true
          courseAssignmentStore.fetchAssignmentCourse('deleted')
          // fetchCompanyAssignmentList({ status: 'active' })
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: 'Assignment has been successfully deleted'
          })
        } else {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: `${res.data.message}`
          })
        }
      },
      (error) => {
        statusOfAssignmentAPI.value = false
      }
    )
  }

  function fetchCompanyAssignmentList(payload) {
    return manageLoading(async () => {
      let isUserListExists = 1
      const assignmentsList = []
      let index = 1
      while (isUserListExists >= 1) {
        try {
          const res = await api.post('company/assign/list', payload)
          if (res.data.success) {
            res.data.data.Items.forEach((info) => {
              assignmentsList.push({
                index: index++,
                name: info.name.toString(),
                id: info.sk,
                events: info.events,
                users: info.users,
                end_date: info.end_date,
                start_date: info.start_date,
                delivery_id: info.delivery_id || '',
                status_assignment: info.status_assignment
              })
            })

            if (res.data.data.LastEvaluatedKey) {
              paginatedAssignment.value = res.data.data.LastEvaluatedKey
              payload = {
                LastEvaluatedKey: res.data.data.LastEvaluatedKey
              }
            } else {
              isUserListExists = 0
              payload = {}
              paginatedAssignment.value = {}
            }
          }
        } catch (err) {
          isUserListExists = 0
          payload = {}
        }
      }
      assignmentList.value = assignmentList.value
    })
  }

  function fetchCompanyChallengeAssignmentList(payload) {
    return manageLoading(async () => {
      let index = 1
      let resetData = false
      if (payload.reset) {
        resetData = payload.reset
        delete payload.reset
      }
      const currentPayload = {
        ...payload,
        status: payload.status || 'active',
        test_type: payload.test_type
      }

      const res = await apiTests.post('test-assign/list', currentPayload, { noLoading: true })
      if (res.data.success) {
        const assignmentsList = res.data.data.map((info) => ({
          index: index++,
          name: info.name.toString(),
          id: info.sk,
          events: info.events,
          active: info.active,
          users: info.users,
          teams: info?.teams ?? [],
          description: info.description,
          end_date: info.end_date,
          duration: info.duration,
          start_date: info.start_date,
          delivery_id: info.delivery_id || '',
          status_assignment: info.status_assignment,
          pass_percentage: info.pass_percentage,
          type: info.test_type
        }))

        if (resetData) {
          challengeAssignmentList.value = assignmentsList
          loadedChallengeAssignmentType.value = payload.test_type
        } else {
          challengeAssignmentList.value.push(...assignmentsList)
        }
        paginatedChallengeAssignment.value = res.data.last_value || {}
      }
    })
  }

  function finalizeLab(payload, type) {
    return manageLoading(
      async () => {
        const res = await apiTests.post('test-assign/finalize', payload)

        challengeAssignmentList.value = challengeAssignmentList.value.map((item) => {
          if (item.id === payload.test) {
            item.active = true
          }
          return item
        })
        if (res.data) {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: `${type === 'interview' ? 'Interview' : 'Tournament'} finalized successfully`
          })
        }
        return res
      },
      async (error) => {
        if (error.response) {
          console.log(error)
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: error.response?.data?.message
          })
        }
      }
    )
  }

  function fetchCompanyAssignmentUserList(payload) {
    return manageLoading(async () => {
      let isUserListExists = 1
      const assignmentsList = []
      let index = 1
      while (isUserListExists >= 1) {
        try {
          const res = await api.post('company/user/assign', payload).then((res) => {
            if (res.data.success) {
              res.data.data.Items.forEach((info) => {
                assignmentsList.push({
                  index: index++,
                  name: info.name.toString(),
                  id: info.sk,
                  events: info.events,
                  users: info.users,
                  end_date: info.end_date,
                  start_date: info.start_date,
                  delivery_id: info.delivery_id || ''
                })
              })

              if (res.data.data.LastEvaluatedKey) {
                paginatedUserAssignment.value = res.data.data.LastEvaluatedKey
                payload = {
                  LastEvaluatedKey: res.data.data.LastEvaluatedKey
                }
              } else {
                isUserListExists = 0
                payload = {}
                paginatedUserAssignment.value = {}
              }
            }
          })
        } catch (error) {
          isUserListExists = 0
          payload = {}
        }
      }
      assignmentUserList.value = assignmentsList
    })
  }

  function fetchCompanyAssignmentUserListPaginated(payload) {
    return manageLoading(async () => {
      const res = api.post('company/user/assign', payload)
      if (res.data.success) {
        const assignmentsList = res.data.data.Items.forEach((info, index) => ({
          index: paginatedUserAssignment.value.length + (index + 1),
          name: info.name.toString(),
          id: info.sk,
          events: info.events,
          users: info.users,
          end_date: info.end_date,
          start_date: info.start_date,
          delivery_id: info.delivery_id || ''
        }))
        assignmentUserList.value.push(assignmentsList)
        if (res.data.data.LastEvaluatedKey) {
          paginatedUserAssignment.value = res.data.data.LastEvaluatedKey
        } else {
          paginatedUserAssignment.value = {}
        }
      }
    })
  }

  function fetchPaginatedCompanyTeams(payload) {
    return manageLoading(async () => {
      const res = await api.post('team/list', payload)
      if (res.data.success) {
        const teamsList = res.data.data.Items.map((team) => ({
          name: team.team_name,
          id: team.sk,
          teamId: urlSafeBase64Encode(team.sk)
        }))
        paginatesListTeams.value = teamsList
        if (res.data.data.LastEvaluatedKey) {
          paginatedTeams.value = res.data.data.LastEvaluatedKey
        } else {
          paginatedTeams.value = {}
        }
      }
    })
  }

  function spliceChallengeAssignment(id) {
    challengeAssignmentList.value = challengeAssignmentList.value.filter((challenge) => challenge.id !== id)
  }

  function computeAssignmentMetrics(payload) {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.post('assignment/metrics/compute', payload)
        if (res.data.success) {
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: res?.data?.message ?? 'Assignment metrics have been successfully updated'
          })
        }
        return res
      },
      (error) => {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'Failed to compute assignment metrics'
        })
      }
    )
  }

  return {
    isLoading,
    certificateStatusInfo,
    assignmentList,
    challengeAssignmentList,
    statusOfUserAPI,
    usersListByAssignment,
    assignmentUserList,
    issuedCertificateInfo,
    assignmentInfo,
    assignmentTestsInfo,
    paginatedTeams,
    paginationAssignmentKeyForward,
    paginatedUsers,
    paginatedEvents,
    statusOfAssignmentAPI,
    statusOfVerifyAPI,
    verificationOptions,
    errorAssignment,
    errorCertificate,
    errorVerification,
    totalUsersList,
    totalFilteredUsersList,
    totalTeamUsersList,
    paginatesListTeams,
    fetchTeamInfoWeekly,
    fetchTeamInfoMonthly,
    skillsInfo,
    paginatedAssignment,
    paginatedChallengeAssignment,
    paginatedUserAssignment,
    errorMsgsReportTeam,
    errorMsgsReportTeamOverall,
    filterStateChallenge,
    sectionPage,
    attachChallenge,
    setStateChallenge,
    setErrorMessageReportTeam,
    setErrorMessageReportTeamOverAll,
    setErrorAssignment,
    setErrorCertificate,
    manageLoadingWithOptions,
    manageLoading,
    createCompanyAssignment,
    createCompanyChallengeAssignment,
    updateCompanyChallengeAssignment,
    assignCertificateSend,
    createCompanyCertificate,
    fetchCompanyAssignmentGet,
    fetchIssuedCertificateInfo,
    fetchVerificationOptions,
    fetchSkillsQueryData,
    updateCompanyAssignment,
    deleteCompanyAssignment,
    fetchCompanyAssignmentList,
    fetchCompanyChallengeAssignmentList,
    finalizeLab,
    fetchCompanyAssignmentUserList,
    fetchCompanyAssignmentUserListPaginated,
    fetchPaginatedCompanyTeams,
    updateTestsAssignmentInfo,
    errorMsgResetVerification,
    loadedChallengeAssignmentType,
    pageFilters,
    spliceChallengeAssignment,
    computeAssignmentMetrics
  }
})
