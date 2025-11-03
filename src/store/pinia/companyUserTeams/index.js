import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { convertDateFormate, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { api } from 'src/boot/axios'
import { computed, ref } from 'vue'
import { email } from 'src/utils/rules'
import { getTimeSpent } from 'src/utils/dateHelper'
import { useCompanyTeam } from 'src/store/pinia/company/team'

export const useCompanyUserTeamsStore = defineStore('companyUserTeams', () => {
  const isLoading = ref(false)
  const isLoadingTeam = ref(false)
  const isError = ref('')
  const teamList = ref([])
  const showMore = ref(false)
  const usersListByTeam = ref([])
  const teamInfo = ref({})
  const paginatedTeam = ref({})
  const paginatedTeamUsers = ref({})
  const user_attach_error_msg = ref({})
  const statusOfTeamAPI = ref({ status: false, data: '', info: [], message: '' })
  const errorCompanyTeam = ref({
    team_name: false,
    team_name_msg: '',
    manager: false,
    manager_msg: '',
    director: false,
    director_msg: '',
    vp: false,
    vp_msg: '',
    division: false,
    division_msg: ''
  })
  const errorCompanyIncludeUsers = ref({ users: false, users_msg: '' })
  const totalUsersList = ref([])
  const totalFilteredUsersList = ref([])
  const totalTeamUsersList = ref([])
  const listOfUsers = ref([])
  // const listOfUsersEmail = ref([])
  const downloadXLSReport = ref([])
  const fetchTeamInfoWeekly = ref([])
  const fetchTeamInfoMonthly = ref([])
  const errorMsgsReportTeam = ref({ status: false, status_msg: '' })
  const errorMsgsReportTeamOverall = ref({ status: false, status_msg: '' })
  const _managersList = ref([])
  const companyTeamStore = useCompanyTeam()

  async function manageLoading(callback, errorCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      console.log(error)
      return errorCallback ? errorCallback(error) : undefined
    } finally {
      isLoading.value = false
    }
  }
  function mapAndPush(refs, data) {
    data.map((item) => refs.push(item))
  }
  function setErrorMsgReportTeamOverall(refs, data) {
    errorMsgsReportTeamOverall.value = Object.assign(refs, data)
  }
  function setErrorMsgsReportTeam(refs, data) {
    errorMsgsReportTeam.value = Object.assign(refs, data)
  }
  function clearCreateTeamErrors(data) {
    statusOfTeamAPI.value = data
  }
  function errorMsgReset(data) {
    errorCompanyTeam.value = data
  }
  function errorMsgResetIncludeUsers(data) {
    errorCompanyIncludeUsers.value = data
  }
  function isStatusCmpyTeams(data) {
    isLoading.value = data
  }
  function createCompanyTeam(payload, loadTeams = false) {
    return manageLoading(
      async () => {
        errorCompanyTeam.value = {
          team_name: false,
          team_name_msg: '',
          manager: false,
          manager_msg: '',
          director: false,
          director_msg: '',
          vp: false,
          vp_msg: '',
          division: false,
          division_msg: ''
        }
        const res = await api.post('team/create', payload)
        if (res.data.success) {
          statusOfTeamAPI.value = { status: false, data: '', info: [], message: res.data.message }
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'The team has been successfully created' })
          if (loadTeams) {
            companyTeamStore.loadAllTeams()
          }
        }
      },
      (error) => {
        let msg = ''
        if (error.response.data.message.team_name) {
          msg = error.response.data.message.team_name.toString()
          statusOfTeamAPI.value = { status: true, data: error.response.data, info: [], message: msg }
        } else {
          statusOfTeamAPI.value = { status: true, data: error.response.data, info: [], message: error.response.data.message }
        }
        isError.value = error
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status === 400) {
          const err_msgs = {
            team_name: false,
            team_name_msg: '',
            manager: false,
            manager_msg: '',
            director: false,
            director_msg: '',
            vp: false,
            vp_msg: '',
            division: false,
            division_msg: ''
          }
          if (error.response.data.message.team_name) {
            if (typeof error.response.data.message.team_name === 'object') {
              err_msgs.team_name = true
              err_msgs.team_name_msg = error.response.data.message.team_name.toString()
            } else {
              err_msgs.team_name = true
              err_msgs.team_name_msg = error.response.data.message.team_name
            }
          }
          if (error.response.data.message.manager) {
            if (typeof error.response.data.message.manager === 'object') {
              err_msgs.manager = true
              err_msgs.manager_msg = error.response.data.message.manager.toString()
            } else {
              err_msgs.manager = true
              err_msgs.manager_msg = error.response.data.message.manager
            }
          }
          if (error.response.data.message.director) {
            if (typeof error.response.data.message.director === 'object') {
              err_msgs.director = true
              err_msgs.director_msg = error.response.data.message.director.toString()
            } else {
              err_msgs.director = true
              err_msgs.director_msg = error.response.data.message.director
            }
          }
          if (error.response.data.message.vp) {
            if (typeof error.response.data.message.vp === 'object') {
              err_msgs.vp = true
              err_msgs.vp_msg = error.response.data.message.vp.toString()
            } else {
              err_msgs.vp = true
              err_msgs.vp_msg = error.response.data.message.vp
            }
          }
          if (error.response.data.message.division) {
            if (typeof error.response.data.message.division === 'object') {
              err_msgs.division = true
              err_msgs.division_msg = error.response.data.message.division.toString()
            } else {
              err_msgs.division = true
              err_msgs.division_msg = error.response.data.message.division
            }
          }
          errorCompanyTeam.value = err_msgs
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }
  function fetchCompanyTeam(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('team/get', payload)
        if (res.data.success) {
          _managersList.value = res.data.data.managers
          const attrib = res.data.data.attributes.map((teamAttrib) => ({
            key: teamAttrib,
            value: res.data.data.data[teamAttrib]
          }))
          teamInfo.value = {
            name: res.data.data.data.team_name,
            id: res.data.data.data.sk,
            customFields: attrib,
            validationFields: res.data.data.attributes
          }
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function updateCompanyTeam(payload) {
    return manageLoading(
      async () => {
        errorCompanyTeam.value = {
          team_name: false,
          team_name_msg: '',
          manager: false,
          manager_msg: '',
          director: false,
          director_msg: '',
          vp: false,
          vp_msg: '',
          division: false,
          division_msg: ''
        }
        const res = await api.post('team/update', payload)
        if (res.data.success) {
          statusOfTeamAPI.value = { status: false, data: '', info: [], message: res.data.message }
          fetchCompanyTeams({})
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'the team has been successfully updated' })
        } else {
          $q.notify({
            type: 'negative',
            message: `${res.data.message}`,
            position: 'top',
            progress: true,
            icon: 'warning'
          })
        }
      },
      (error) => {
        isError.value = error
        let msg = ''
        if (error.response.data.message.team_name) {
          msg = error.response.data.message.team_name.toString()
          statusOfTeamAPI.value = { status: true, data: error.response.data, info: [], message: msg }
        } else {
          statusOfTeamAPI.value = { status: true, data: error.response.data, info: [], message: error.response.data.message }
        }
        if (error.response.status === 400) {
          const err_msgs = {
            team_name: false,
            team_name_msg: '',
            manager: false,
            manager_msg: '',
            director: false,
            director_msg: '',
            vp: false,
            vp_msg: '',
            division: false,
            division_msg: ''
          }
          if (error.response.data.message.team_name) {
            if (typeof error.response.data.message.team_name === 'object') {
              err_msgs.team_name = true
              err_msgs.team_name_msg = error.response.data.message.team_name.toString()
            } else {
              err_msgs.team_name = true
              err_msgs.team_name_msg = error.response.data.message.team_name
            }
          }
          if (error.response.data.message.manager) {
            if (typeof error.response.data.message.manager === 'object') {
              err_msgs.manager = true
              err_msgs.manager_msg = error.response.data.message.manager.toString()
            } else {
              err_msgs.manager = true
              err_msgs.manager_msg = error.response.data.message.manager
            }
          }
          if (error.response.data.message.director) {
            if (typeof error.response.data.message.director === 'object') {
              err_msgs.director = true
              err_msgs.director_msg = error.response.data.message.director.toString()
            } else {
              err_msgs.director = true
              err_msgs.director_msg = error.response.data.message.director
            }
          }
          if (error.response.data.message.vp) {
            if (typeof error.response.data.message.vp === 'object') {
              err_msgs.vp = true
              err_msgs.vp_msg = error.response.data.message.vp.toString()
            } else {
              err_msgs.vp = true
              err_msgs.vp_msg = error.response.data.message.vp
            }
          }
          if (error.response.data.message.division) {
            if (typeof error.response.data.message.division === 'object') {
              err_msgs.division = true
              err_msgs.division_msg = error.response.data.message.division.toString()
            } else {
              err_msgs.division = true
              err_msgs.division_msg = error.response.data.message.division
            }
          }
          errorCompanyTeam.value = err_msgs
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }
  function deleteCompanyTeam(payload) {
    return manageLoading(
      async () => {
        console.log(isLoading.value)
        const res = await api.post('team/delete', payload)
        if (res.data.success) {
          fetchCompanyTeams({})
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'The team has been successfully deleted' })
        } else {
          $q.notify({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: `${res.data.message}`
          })
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function deleteUserFromCompanyTeam(payload) {
    return manageLoading(async () => {
      const res = await api.post('team/user-remove', payload)
      if (res.data.success) {
        fetchUsersByTeam({ team_id: payload.team_id })
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'User has been removed from the Team' })
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: `${res.data.message}`
        })
      }
    })
  }
  function fetchCompanyTeams(payload) {
    isLoadingTeam.value = true
    return manageLoading(
      async () => {
        const res = await api.post('team/list', payload, { noLoading: true })
        if (res.data.success) {
          const teamsList = res.data.data.Items.map((team) => ({
            name: team.team_name.toString(),
            id: team.sk,
            teamId: urlSafeBase64Encode(team.sk)
          }))
          teamList.value = teamsList
          if (res.data.data.LastEvaluatedKey) {
            showMore.value = true
            paginatedTeam.value = res.data.data.LastEvaluatedKey
          } else {
            showMore.value = false
            paginatedTeam.value = {}
          }
        }
      },
      (error) => {
        isError.value = error
      }
    ).finally(() => (isLoadingTeam.value = false))
  }
  function fetchPaginatedCompanyTeams(payload) {
    return manageLoading(
      async () => {
        isLoadingTeam.value = true
        const res = await api.post('team/list', payload)
        if (res.data.success) {
          const teamsList = res.data.data.Items.map((team) => ({
            name: team.team_name,
            id: team.sk,
            teamId: urlSafeBase64Encode(team.sk)
          }))
          mapAndPush(teamList.value, teamsList)
          if (res.data.data.LastEvaluatedKey) {
            showMore.value = true
            paginatedTeam.value = res.data.data.LastEvaluatedKey
          } else {
            showMore.value = false
            paginatedTeam.value = {}
          }
        }
      },
      (error) => {
        isError.value = error
      }
    ).finally(() => {
      isLoadingTeam.value = false
    })
  }
  function searchCompanyTeam(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('company/search-team', payload)
        if (res.data.success) {
          const teamsList = []
          res.data.data.data.map((team) => ({
            name: team.team_name,
            id: team.sk,
            teamId: urlSafeBase64Encode(team.sk)
          }))
          teamList.value = teamsList
          if (res.data.data.LastEvaluatedKey) {
            paginatedTeam.value = res.data.data.LastEvaluatedKey
          } else {
            paginatedTeam.value = {}
          }
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }

  async function manageTeamManager(payload) {
    isLoading.value = true
    const res = await api.post('team/managers', payload)
    isLoading.value = false
    if (res.data.success && payload.type === 'ADD') {
      Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Team Manager has been added successfully.' })
    } else if (payload.type === 'REMOVE') {
      Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Team Manager has been deleted successfully.' })
    } else {
      Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
    }
  }

  async function updateTeamManagerList(listData) {
    const addedToList = listData.concat(_managersList.value)
    _managersList.value = addedToList
  }

  async function removeTeamManager(listData) {
    _managersList.value = _managersList.value.filter((info) => info !== listData)
  }

  function includeUserIntoTeam(payload) {
    return manageLoading(
      async () => {
        errorCompanyIncludeUsers.value = { users: false, users_msg: '' }
        user_attach_error_msg.value = {}
        const res = await api.post('team/user-attach', payload)
        if (res.data.success) {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'User has been added to the team successfully.' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      },
      (error) => {
        user_attach_error_msg.value = {}
        isError.value = error
        if (error.response.status === 400) {
          if (error.response.data.message.users) {
            if (typeof error.response.data.message.users === 'object') {
              errorCompanyIncludeUsers.value = { users: true, users_msg: error.response.data.message.users.toString() }
            } else {
              errorCompanyIncludeUsers.value = { users: true, users_msg: error.response.data.message.users }
            }
          } else {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }
  function allUsersList(payload) {
    return manageLoading(async () => {
      const userList = []
      let isUserListExists = 1
      while (isUserListExists >= 1) {
        isLoading.value = true
        try {
          const res = await api.post('company/users-list', payload.users, { noLoading: true })
          if (res.data.success) {
            res.data.data.Items.forEach((user) => {
              userList.push({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                isActive: user.is_active,
                fullName: user.full_name
              })
            })
            if (res.data.data.LastEvaluatedKey) {
              payload.users.LastEvaluatedKey = res.data.data.LastEvaluatedKey
              isUserListExists += 1
            } else {
              isUserListExists = 0
              payload.users = {}
            }
          }
        } catch (error) {
          isUserListExists = 0
          isError.value = error
        }
      }
      listOfUsers.value = userList
    })
  }

  async function includeUsersFinalList(payload) {
    const userList = []
    let isUserListExists = 1
    while (isUserListExists >= 1) {
      await manageLoading(
        async () => {
          const res = await api.post('company/users-list', payload.users)
          if (res.data.success) {
            res.data.data.Items.forEach((user) => {
              userList.push({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                isActive: user.is_active,
                fullName: user.full_name,
                duration: getTimeSpent(user.duration * 60)
              })
            })
            if (res.data.data.LastEvaluatedKey) {
              payload.users.LastEvaluatedKey = res.data.data.LastEvaluatedKey
              isUserListExists += 1
            } else {
              isUserListExists = 0
              payload.users = {}
            }
          }
        },
        (error) => {
          isUserListExists = 0
          isError.value = error
        }
      )
    }
    totalUsersList.value = userList
    const teamUserList = []
    let isTeamUserListExists = 1
    while (isTeamUserListExists >= 1) {
      await manageLoading(
        async () => {
          const res = await api.post('team/list-users', payload.team)
          if (res.data.success) {
            res.data.data.Items.forEach((users) => {
              const user = users.sk.split('#')
              teamUserList.push({
                email: user[1],
                fullName: users.full_name,
                teamId: users.pk,
                teamName: users.team_name,
                duration: getTimeSpent(users.duration * 60)
              })
            })
            if (res.data.data.LastEvaluatedKey) {
              payload.team.LastEvaluatedKey = res.data.data.LastEvaluatedKey
              isTeamUserListExists += 1
            } else {
              isTeamUserListExists = 0
              payload.team = {}
            }
          }
        },
        (error) => {
          isTeamUserListExists = 0
          isError.value = error
        }
      )
    }
    const includeUserFinal = userList.filter(({ email: id1 }) => !teamUserList.some(({ email: id2 }) => id2 === id1))
    totalFilteredUsersList.value = includeUserFinal
    totalTeamUsersList.value = teamUserList
    usersListByTeam.value = teamUserList
  }

  async function searchUsers(payload) {
    isLoading.value = true
    try {
      const { data } = await api.post('company/search-team-user', payload)

      const filteredUsers = data.data.data.map((user) => ({
        fullName: user.full_name,
        teamId: user.pk,
        teamName: user.team_name,
        email: user.sk.split('#')[1],
        duration: getTimeSpent(user.duration * 60)
      }))

      usersListByTeam.value.push(...filteredUsers)
      isLoading.value = false
      return filteredUsers
    } catch (err) {
      console.warn(err)
      isLoading.value = false
      return false
    }
  }

  async function clearSearchUsers(team_id) {
    await this.fetchUsersByTeam({ team_id: team_id })
  }

  async function resetListWithAddingOrRemoval(listData) {
    const addedTolist = listData.concat(usersListByTeam.value)
    const includeUserFinal = totalUsersList.value.filter(({ email: id1 }) => !addedTolist.some(({ email: id2 }) => id2 === id1))
    totalFilteredUsersList.value = includeUserFinal
    totalTeamUsersList.value = addedTolist
    usersListByTeam.value = addedTolist
  }
  async function resetListWithRemoval(listData) {
    const removedItemFromTeamUserList = usersListByTeam.value.filter((info) => info !== listData)
    totalTeamUsersList.value = removedItemFromTeamUserList
    const new_list = totalFilteredUsersList.value
    const includeUserFinal = new_list.concat(listData)
    totalFilteredUsersList.value = includeUserFinal
  }
  function fetchUsersByTeam(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('team/list-users', payload)
        if (res.data.success) {
          const userList = []
          res.data.data.Items.forEach((users) => {
            const user = users.sk.split('#')
            userList.push({
              email: user[1],
              fullName: users.full_name,
              teamId: users.pk,
              teamName: users.team_name,
              duration: getTimeSpent(users.duration * 60)
            })
          })
          usersListByTeam.value = userList
          if (res.data.data.LastEvaluatedKey) {
            paginatedTeamUsers.value = res.data.data.LastEvaluatedKey
          } else {
            paginatedTeamUsers.value = {}
          }
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function paginatedUsersByTeam(payload) {
    return manageLoading(
      () => {
        const res = api.post('team/list-users', payload)
        if (res.data.success) {
          const teamUsersList = []
          res.data.data.Items.forEach((users) => {
            const user = users.sk.split('#')
            teamUsersList.push({
              email: user[1],
              fullName: users.full_name,
              teamId: users.pk,
              teamName: users.team_name,
              duration: getTimeSpent(users.duration * 60)
            })
          })
          mapAndPush(usersListByTeam.value, teamUsersList)
          if (res.data.data.LastEvaluatedKey) {
            paginatedTeamUsers.value = res.data.data.LastEvaluatedKey
          } else {
            paginatedTeamUsers.value = {}
          }
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function searchTeamUser(payload) {
    return manageLoading(
      () => {
        const res = api.post('team/list-users', payload)
        if (res.data.success) {
          res.data.data.data.forEach((users) => {
            const user = users.sk.split('#')
            usersListByTeam.value.push({
              email: user[1],
              fullName: users.full_name,
              teamId: users.pk,
              teamName: users.team_name,
              duration: getTimeSpent(users.duration * 60)
            })
          })
          if (res.data.data.LastEvaluatedKey) {
            paginatedTeamUsers.value = res.data.data.LastEvaluatedKey
          } else {
            paginatedTeamUsers.value = {}
          }
        }
      },
      (error) => {
        isError.value = error
      }
    )
  }
  function downloadXLSReportAction(payload) {
    return manageLoading(async () => {
      const error = { status: false, status_msg: '' }
      errorMsgsReportTeamOverall.value = error
      setErrorMsgReportTeamOverall(errorMsgsReportTeamOverall.value, error)
      const reportData = []
      let isUserListExists = 1
      while (isUserListExists >= 1) {
        try {
          const res = await api.post('team/stats', payload.teams)
          if (res.data.success) {
            error.status = true
            setErrorMsgReportTeamOverall(errorMsgsReportTeamOverall.value, error)
            res.data.data.Items.forEach((info) => {
              const addObj = {}
              Object.entries(info).forEach(([key, value]) => {
                if (
                  key &&
                  value &&
                  key !== 'Actual_minutes' &&
                  key !== 'Lab_minutes' &&
                  key !== 'Total_minutes_spent' &&
                  key !== 'Video_minutes' &&
                  key !== 'course_name' &&
                  key !== 'email' &&
                  key !== 'first_name' &&
                  key !== 'last_name' &&
                  key !== 'progress(%)' &&
                  key !== 'sk' &&
                  key !== 'account_status'
                ) {
                  addObj[key] = value
                }
              })
              const objData = {
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
              reportData.push({ ...objData, ...addObj })
            })
            if (res.data.data.pagination) {
              payload.teams.pagination = res.data.data.pagination
              isUserListExists += 1
            } else {
              isUserListExists = 0
              payload.teams = {}
            }
          }
        } catch (err) {
          setErrorMsgReportTeamOverall(errorMsgsReportTeamOverall.value, error)
          isUserListExists = 0
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      }
      downloadXLSReport.value = reportData
    })
  }
  function downloadXLSReportActionWeeklyMonthly(payload) {
    return manageLoading(async () => {
      const error = { status: false, status_msg: '' }
      errorMsgsReportTeam.value = error
      setErrorMsgsReportTeam(errorMsgsReportTeam.value, error)
      const reportDataWeekly = []
      const reportDataMontly = []
      let isTeamListExists = 1
      while (isTeamListExists >= 1) {
        try {
          const res = await api.post('team/monthly-report', payload.teams)
          if (res.data.success) {
            error.status = true
            setErrorMsgsReportTeam(errorMsgsReportTeam.value, error)
            res.data.data.items.monthly.forEach((info) => {
              const addObj = {}
              Object.entries(info).forEach(([key, value]) => {
                if (
                  key &&
                  value &&
                  key !== 'email' &&
                  key !== 'first_name' &&
                  key !== 'last_name' &&
                  key !== 'enrolled_courses' &&
                  key !== 'course_minutes' &&
                  key !== 'lab_minutes' &&
                  key !== 'account_status'
                ) {
                  addObj[key] = value
                }
              })
              const objData = {
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                'Month/year': convertDateFormate(payload.teams.select),
                'Enrolled Courses': info.enrolled_courses,
                'Total course Minutes': info.course_minutes.toString(),
                'Total Lab Minutes': info.lab_minutes.toString(),
                'Account status': info.account_status
              }
              reportDataMontly.push({ ...objData, ...addObj })
            })
            res.data.data.items.weekly.forEach((info) => {
              const addObjWeek = {}
              Object.entries(info).forEach(([key, value]) => {
                if (
                  key &&
                  value &&
                  key !== 'email' &&
                  key !== 'week' &&
                  key !== 'first_name' &&
                  key !== 'last_name' &&
                  key !== 'enrolled_courses' &&
                  key !== 'course_minutes' &&
                  key !== 'lab_minutes' &&
                  key !== 'account_status'
                ) {
                  addObjWeek[key] = value
                }
              })
              const objDataWeekly = {
                Email: info.email,
                'First Name': info.first_name,
                'Last Name': info.last_name,
                Date: convertDateFormate(info.week),
                'Total course Minutes': info.course_minutes.toString(),
                'Total Lab Minutes': info.lab_minutes.toString(),
                'Account status': info.account_status
              }
              reportDataWeekly.push({ ...objDataWeekly, ...addObjWeek })
            })
            if (res.data.data.pagination) {
              payload.teams.pagination = res.data.data.pagination
              isTeamListExists += 1
            } else {
              isTeamListExists = 0
              payload.teams = {}
            }
          }
        } catch (err) {
          isTeamListExists = 0
          setErrorMsgsReportTeam(errorMsgsReportTeam.value, error)
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
      fetchTeamInfoWeekly.value = reportDataWeekly
      fetchTeamInfoMonthly.value = reportDataMontly
    })
  }
  const listOfUsersEmail = computed(() => {
    return listOfUsers.value.map((user) => ({ label: user.email, value: user.email }))
  })
  const getCompanyTeamsList = computed(() => {
    return teamList.value.map((team) => ({ label: team.name, value: team.id }))
  })
  return {
    isLoading,
    isError,
    teamList,
    showMore,
    usersListByTeam,
    teamInfo,
    paginatedTeam,
    paginatedTeamUsers,
    user_attach_error_msg,
    statusOfTeamAPI,
    errorCompanyTeam,
    errorCompanyIncludeUsers,
    totalUsersList,
    totalFilteredUsersList,
    totalTeamUsersList,
    listOfUsers,
    downloadXLSReport,
    fetchTeamInfoWeekly,
    fetchTeamInfoMonthly,
    errorMsgsReportTeam,
    errorMsgsReportTeamOverall,
    listOfUsersEmail,
    getCompanyTeamsList,
    mapAndPush,
    setErrorMsgReportTeamOverall,
    setErrorMsgsReportTeam,
    createCompanyTeam,
    fetchCompanyTeam,
    updateCompanyTeam,
    deleteCompanyTeam,
    deleteUserFromCompanyTeam,
    fetchCompanyTeams,
    fetchPaginatedCompanyTeams,
    searchCompanyTeam,
    includeUserIntoTeam,
    allUsersList,
    includeUsersFinalList,
    resetListWithAddingOrRemoval,
    resetListWithRemoval,
    fetchUsersByTeam,
    paginatedUsersByTeam,
    searchTeamUser,
    downloadXLSReportAction,
    downloadXLSReportActionWeeklyMonthly,
    clearCreateTeamErrors,
    errorMsgReset,
    errorMsgResetIncludeUsers,
    isStatusCmpyTeams,
    isLoadingTeam,
    manageTeamManager,
    _managersList,
    updateTeamManagerList,
    removeTeamManager,
    searchUsers,
    clearSearchUsers
  }
})
