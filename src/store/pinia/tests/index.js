import { Notify } from 'quasar'
import { colorBasedOnIndex } from 'src/utils/reuseFunctions'
import { apiTests } from 'src/boot/axios'
import { apiQuiz } from 'src/boot/axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const initial_error_tests = {
  status: false,
  challenge: false,
  challenge_msg: '',
  score: false,
  score_msg: '',
  persona: false,
  persona_msg: '',
  proficiency: false,
  proficiency_msg: '',
  skills: false,
  skills_msg: ''
}

export const useTestsStore = defineStore('tests', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const errorContests = ref({
    status: false,
    name: false,
    name_msg: '',
    description: false,
    description_msg: '',
    skills: false,
    skills_msg: '',
    persona: false,
    persona_msg: ''
  })
  const listContests = ref([])
  const statusOfAPI = ref(false)
  const optionsSkills = ref([])
  const optionsTestUsers = ref([])
  const optionsPersona = ref([
    { value: 'Cloud Engineer', label: 'Cloud Engineer', logo: 'cloudEngineer.png' },
    { value: 'Developer', label: 'Developer', logo: 'developer.png' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer', logo: 'devops.png' },
    { value: 'Security Engineer', label: 'Security Engineer', logo: 'securityEngineer.png' },
    { value: 'Security Champion', label: 'Security Champion', logo: 'securityChampion.png' },
    { value: 'Security Architect', label: 'Security Architect', logo: 'securityArchitect.png' },
    { value: 'Pentester', label: 'Pentester', logo: 'pentester.png' }
  ])
  const tests = ref([])
  const customTests = ref([])
  const testsKey = ref('')
  const challenges = ref([])
  const errorTests = ref({ ...initial_error_tests })
  const errorChallenges = ref({})
  const contestsInfo = ref({})
  const testsInfo = ref({})
  const assignedTests = ref([])
  const assignedTestsKey = ref({})
  const assignedChallenges = ref({})
  const assignedChallengesKey = ref({})
  const listContestsKey = ref('')
  const listChallengesKey = ref('')
  const assignedTestInfo = ref({})
  const testReportDetails = ref({})
  const testReportInfo = ref({})
  const testReportUser = ref([])
  const testsUserStats = ref({
    data: {
      title: 'Users report',
      name: 'Users report',
      data: []
    },
    title: 'Top Users',
    name: 'Top Users'
  })
  const testAssignmentsStats = ref({
    title: 'Top assignments',
    data: [],
    values: [],
    dataLabels: [],
    totalUsers: 0
  })
  const testSkillsStats = ref({
    data: {
      title: 'Users report',
      name: 'Users report',
      data: []
    },
    dataRanges: [],
    dataValues: [],
    dataLists: [],
    title: 'Top Skills',
    name: 'Top Skills'
  })
  const leaderBoard = ref({
    data: [],
    next: false,
    current_page: 1
  })
  const testPieData = ref([])

  async function manageLoading(callback, errCallback = undefined, options) {
    const { toggleLoading, toggleStatusOfAPI, updateError, handleNetworkError } = {
      toggleStatusOfAPI: false,
      toggleLoading: true,
      updateError: true,
      handleNetworkError: false,
      ...options
    }
    try {
      toggleLoading && (isLoading.value = true)
      toggleStatusOfAPI && (statusOfAPI.value = false)
      const result = await callback()
      toggleStatusOfAPI && (statusOfAPI.value = true)
      return result
    } catch (error) {
      updateError && (isError.value = error)
      toggleStatusOfAPI && (statusOfAPI.value = false)
      if (handleNetworkError && error.toString() === 'Error: Network Error') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
      }
      errCallback ? errCallback(error) : undefined
    } finally {
      toggleLoading && (isLoading.value = false)
    }
  }
  function errorMsgResetTests(data) {
    errorTests.value = data
  }
  function generateErrorTestsOnBadRequest(error, payload, default_err_msgs, iterate_message = true) {
    if (error.response.status === 400) {
      const err_msgs = { ...default_err_msgs }
      Object.entries(payload).forEach(([key, value]) => {
        err_msgs[key] = false
        err_msgs[key + '_msg'] = ''
      })
      if (iterate_message) {
      } else {
        if (error.response.data.errors) {
          error.response.data.errors.forEach((data) => {
            err_msgs[data.attribute] = true
            err_msgs[data.attribute + '_msg'] = data.msg
          })
        }
      }
      return err_msgs
    }
  }
  function clearTests() {
    tests.value = []
    customTests.value = []
  }

  function createTests(payload, listApiCall = true) {
    return manageLoading(
      async () => {
        errorTests.value = { ...initial_error_tests }
        const res = await apiTests.post('test/attach', payload)
        if (listApiCall) {
          fetchTests({ test: payload.test })
        } else {
          tests.value.push(res.data?.data)
        }
        Notify.create({ type: 'positive', position: 'top', progress: true, message: `Challenge attached` })
      },
      (error) => {
        if (error.response.status === 400) {
          errorTests.value = generateErrorTestsOnBadRequest(
            error,
            payload,
            {
              status: false,
              challenge: false,
              challenge_msg: '',
              score: false,
              score_msg: ''
            },
            false
          )
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      },
      {
        toggleStatusOfAPI: true,
        handleNetworkError: true
      }
    )
  }

  function updateTests(payload) {
    return manageLoading(
      async () => {
        errorTests.value = {
          status: false,
          challenge: false,
          challenge_msg: '',
          score: false,
          score_msg: ''
        }
        const res = await apiTests.post('test/update', payload)
        fetchTests({ test: payload.test })
        Notify.create({ type: 'positive', position: 'top', progress: true, message: `${res.data.message}` })
      },
      (error) => {
        if (error.response.status === 400) {
          errorTests.value = generateErrorTestsOnBadRequest(error, payload, {
            status: false,
            challenge: false,
            challenge_msg: '',
            score: false,
            score_msg: ''
          })
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      },
      {
        toggleStatusOfAPI: true,
        handleNetworkError: true
      }
    )
  }

  function deleteTests(payload, type) {
    return manageLoading(
      async () => {
        await apiTests.delete('test-assign/delete', { data: payload })
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          message: `${type === 'interview' ? 'Interview' : 'Tournament'} deleted successfully`
        })
        return true
      },
      (error) => {
        if (error.response.data.message) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
        return false
      },
      {
        toggleStatusOfAPI: true,
        handleNetworkError: true
      }
    )
  }

  function deleteAddedChallenge(payload, manualSplice = true) {
    return manageLoading(
      async () => {
        const res = await apiTests.post('test/detach', payload)
        if (manualSplice) {
          const index = tests.value.findIndex((test) => test.sk === payload.challenge)
          tests.value.splice(index, 1)
        }
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          message: `Challenge detached`
        })
      },
      (error) => {
        if (error.response.data.message) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      },
      {
        toggleStatusOfAPI: true,
        handleNetworkError: true
      }
    )
  }

  function fetchContests(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('contest/list', payload)
      if (res.data.success) {
        listContests.value = res.data.data
        listContestsKey.value = res.data.data.LastEvaluatedKey ?? ''
      }
    })
  }

  function fetchPersona(payload) {
    //not converted because it was commented in vuex store
    // await apiTests
    //   .post('persona/list', payload)
    //   .then((res) => {
    //     const persona = []
    //     res.data.data.map((data) => {
    //       persona.push({ label: data, value: data })
    //     })
    //     commit('OPTIONS_PERSONA', persona)
    //     commit('IS_LOADING', false)
    //   })
    //   .catch((error) => {
    //     commit('IS_LOADING', false)
    //     commit('IS_ERROR', error)
    //   })
  }

  function fetchSkills(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('skills/list', payload)
      optionsSkills.value = res.data.data.map((data) => ({ label: data, value: data }))
    })
  }

  function fetchUsersTests(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('skills/list', payload)
      optionsSkills.value = res.data.data.map((data) => ({ label: data, value: data }))
    })
  }

  function fetchTestReportDetails(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('test-assign/get', payload)
      testReportDetails.value = res.data.data
    })
  }

  function fetchTestReportInfo(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('test-assign/test-report', payload)
      testReportInfo.value = {
        info: res.data.data,
        dataLabels: res.data.data.map((res) => res.email),
        dataValues: res.data.data.map((res) => ((res.score / res.total_score) * 100).toFixed(2)),
        data: res.data.data.map((res) => ({
          name: res.email,
          value: ((res.score / res.total_score) * 100).toFixed(2)
        }))
      }
    })
  }

  function fetchTestReportUsers(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('test-assign/user-report', payload)
      testReportUser.value = res.data.data
    })
  }

  function fetchTopTestAssignments(payload) {
    return manageLoading(async () => {
      const graphData = []
      const graphValues = []
      const graphDataLabels = []
      const challengesInfo = []
      let loopIndex = 0
      const res = await apiTests.post('test/top-assign', payload)
      if (res.data.success) {
        res.data.data.forEach((data) => {
          loopIndex += 1

          if (data.test) {
            graphValues.push(`${((data.total_scored / data.total_score) * 100).toFixed(2)}`)
            graphData.push({
              name: data.test.name,
              value: `${((data.total_scored / data.total_score) * 100).toFixed(2)} `,
              itemStyle: { color: colorBasedOnIndex(loopIndex) }
            })

            if (data.test.challenges) {
              const challengesData = []
              let loopChallengeIndex = 0
              data.test.challenges.forEach((subData) => {
                loopChallengeIndex += 1
                challengesData.push({
                  name: subData.challenge_name,
                  value: subData.score,

                  itemStyle: { color: colorBasedOnIndex(loopChallengeIndex) }
                })
              })
              challengesInfo.push({
                test_id: data.test.sk,
                test_name: data.test.name,
                users: data.test.users,
                teams: data.test.teams,
                total_score: data.test.total_score,
                duration: data.test.duration,
                description: data.test.description,
                challenges: challengesData
              })
            }

            graphDataLabels.push(data.test.name)
          }
        })
      }

      const sortedArray = graphData.sort((a, b) => b.value - a.value)
      testAssignmentsStats.value = {
        data: sortedArray.map((item) => item),
        values: sortedArray.map((item) => item.name),
        dataLabels: sortedArray.map((item) => item.name),
        c_info: challengesInfo
      }
    })
  }

  function fetchTopTestSkills(payload) {
    return manageLoading(async () => {
      const graphData = []
      const graphDataLabels = []
      const graphDataValues = []
      const graphDataRanges = []
      const graphDataAllocatedRanges = []
      let loopIndex = 0

      const res = await apiTests.post('test/top-skills', payload)
      if (res.data.success) {
        for (const data of res.data.data) {
          loopIndex += 1
          graphData.push({
            name: data.skill,
            value: data.pass_count,
            itemStyle: { color: colorBasedOnIndex(loopIndex) }
          })
          graphDataAllocatedRanges.push({
            name: data.skill,
            max: data.max_count,
            itemStyle: { color: colorBasedOnIndex(loopIndex) }
          })
          graphDataLabels.push(data.skill || '')
          graphDataValues.push(data.pass_count || 0)
          graphDataRanges.push(data.max_count || 0)
        }
      }

      testSkillsStats.value = {
        data: graphData,
        dataLabels: graphDataLabels,
        dataValues: graphDataValues,
        dataRanges: graphDataRanges,
        allocated: graphDataAllocatedRanges,
        legend: ['Skills Secured', 'Skills Actual']
      }
    })
  }

  function fetchTopTestUsers(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('test/top-users', payload)
      if (res.data.success) {
        const keysInfo = []
        const scoredInfo = []
        const passedInfo = []
        const assignedInfo = []

        res.data.data.forEach((data) => {
          scoredInfo.push(data.total_scored || 0)
          passedInfo.push(data.total_tests_passed || 0)
          assignedInfo.push(data.total_tests_assigned || 0)
          keysInfo.push(data.email || 0)
        })
        const usersStats = {
          labels: keysInfo,
          colors: ['#4FA0E1', '#58D8A5', '#EC8937', '#6900FF'],
          title: 'User report',
          name: 'User report',
          data: [
            {
              name: 'Tests Attempted',
              type: 'line',
              stack: 'line',
              data: assignedInfo
            },
            {
              name: 'Tests Passed',
              type: 'line',
              data: passedInfo
            },
            {
              name: 'Scored',
              type: 'line',
              data: scoredInfo
            }
          ]
        }
        testsUserStats.value = { data: usersStats, name: 'Top Users', title: 'Top Users' }
      }
    })
  }

  function fetchContestsPaginated(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('contest/list', payload)
      if (res.data.success) {
        res.data.data?.map((info) => listContests.value.push(info))
        listContestsKey.value = res.data.data.LastEvaluatedKey ?? ''
      }
    })
  }

  function fetchTests(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('test/list', payload)
      if (res.data.success) {
        tests.value = res.data.data
        customTests.value = res.data.quizes
        testsKey.value = res.data.data.LastEvaluatedKey ?? ''
      }
    })
  }

  function attachChallenge(payload) {
    return manageLoading(
      async () => {
        await apiQuiz.post('publish-challenge', payload)
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          message: 'Challenge attached',
          icon: 'done'
        })
      },
      (error) => {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          message: 'Error attaching challenge',
          icon: 'report_problem'
        })
        return false
      },
      {
        updateError: false
      }
    )
  }

  function fetchAssignedChallenges(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('consumer/test/list', payload)
      if (res.data.success) {
        assignedChallenges.value = res.data.data
        listChallengesKey.value = res.data.data.LastEvaluatedKey ?? ''
      }
    })
  }

  function fetchTestsPaginated(payload) {
    return manageLoading(async () => {
      const res = await apiTests.post('test/list', payload)
      if (res.data.success) {
        res.data.data?.map((user) => tests.value.push(user))
        testsKey.value = res.data.data.LastEvaluatedKey ?? ''
      }
    })
  }

  async function fetchChallenges(payload) {
    return manageLoading(async () => {
      let allChallenges = []

      async function fetchPage(paginationPayload) {
        const res = await apiTests.post('challenge/list', paginationPayload)
        if (res.data.success) {
          const data = res.data.data
            .filter((labData) => labData.sk)
            .map((labData) => ({
              label: labData.name,
              value: labData.sk,
              score: labData.score,
              solutions: labData.solutions || []
            }))

          allChallenges.push(...data)

          if (res.data.last_value) {
            paginationPayload.last_value = res.data.last_value
            await fetchPage(paginationPayload)
          }
        }
      }

      await fetchPage(payload.pagination)

      // Update the challenges list
      if (payload?.pagination?.last_value) {
        challenges.value.push(...allChallenges)
      } else {
        challenges.value = allChallenges
      }

      listChallengesKey.value = allChallenges.length ? allChallenges[allChallenges.length - 1].value : ''
    })
  }
  function searchContests(payload) {
    return manageLoading(async () => {
      const res = apiTests.post('company/search-user', payload)
      if (res.data.success) {
        const userList = []
        const userListOption = []
        const inActiveUsers = []
        res.data.data.data.forEach((user) => {
          if (user.is_active) inActiveUsers.push(user.email)

          userList.push({
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            isActive: user.is_active,
            fullName: user.full_name,
            option: [
              {
                value: user.email,
                label: ''
              }
            ],
            resend: user.resend
          })
          userListOption.push({
            value: user.email,
            label: user.first_name.toString() + ' ' + `(${user.email})`
          })
        })
        listContests.value = userList
        listContestsKey.value = res.data.data.LastEvaluatedKey ?? ''
      }
    })
  }

  function createContests(payload) {
    return manageLoading(
      async () => {
        statusOfAPI.value = false
        errorContests.value = {
          name: false,
          name_msg: '',
          description: false,
          description_msg: '',
          skills: false,
          skills_msg: '',
          persona: false,
          persona_msg: ''
        }
        const res = await apiTests.post('contest/create', payload)
        res.data.success && (statusOfAPI.value = true)
        Notify.create({ type: 'positive', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
      },
      (error) => {
        statusOfAPI.value = false
        if (error.response.status === 400) {
          errorContests.value = generateErrorTestsOnBadRequest(error, payload, {
            status: false,
            name: false,
            name_msg: '',
            description: false,
            description_msg: '',
            skills: false,
            skills_msg: '',
            persona: false,
            persona_msg: ''
          })
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      },
      {
        handleNetworkError: true
      }
    )
  }

  function updateContests(payload) {
    return manageLoading(
      async () => {
        statusOfAPI.value = false
        errorContests.value = {
          name: false,
          name_msg: '',
          description: false,
          description_msg: '',
          skills: false,
          skills_msg: '',
          persona: false,
          persona_msg: ''
        }
        const res = await apiTests.post('contest/update', payload)
        fetchContests()
        res.data.success && (statusOfAPI.value = true)
        Notify.create({ type: 'positive', position: 'top', progress: true, message: `${res.data.message}` })
      },
      (error) => {
        statusOfAPI.value = false
        if (error.response.status === 400) {
          errorContests.value = generateErrorTestsOnBadRequest(error, payload, {
            status: false,
            name: false,
            name_msg: '',
            description: false,
            description_msg: '',
            skills: false,
            skills_msg: '',
            persona: false,
            persona_msg: ''
          })
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      },
      {
        handleNetworkError: true
      }
    )
  }

  function deleteContests(payload) {
    return manageLoading(
      async () => {
        statusOfAPI.value = true
        errorContests.value = {
          name: false,
          name_msg: '',
          description: false,
          description_msg: '',
          skills: false,
          skills_msg: '',
          persona: false,
          persona_msg: ''
        }
        const res = await apiTests.post('contest/remove', payload)
        res.data.success && (statusOfAPI.value = true)
        Notify.create({ type: 'positive', position: 'top', progress: true, message: `${res.data.message}` })
      },
      (error) => {
        statusOfAPI.value = false
        if (error.response.status === 400) {
          errorContests.value = generateErrorTestsOnBadRequest(error, payload, { status: false })
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response.data.message
        })
      },
      {
        handleNetworkError: true
      }
    )
  }

  function fetchTestsInfo(payload) {
    testsInfo.value = payload
  }
  function resetChallenges() {
    challenges.value = []
    listChallengesKey.value = ''
  }

  function fetchReport(testId) {
    return manageLoading(
      async () => {
        const response = await apiTests.post('test-assign/overall-report', { test: testId, page: 1 })
        console.log(response)
        // Process the response data
        if (response?.data?.data) {
          // Store leaderboard data
          if (response?.data?.data?.leaderboard) {
            leaderBoard.value = response.data.data.leaderboard
          }

          // Store pie chart data
          if (response.data.data.pie_chart) {
            testPieData.value = response.data.data.pie_chart
          }
        }

        console.log(leaderBoard.value)
        console.log(testPieData.value)

        return response.data
      },
      (error) => {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response?.data?.message || 'Failed to fetch test report'
        })
      }
    )
  }

  return {
    isLoading,
    isError,
    errorContests,
    listContests,
    statusOfAPI,
    optionsSkills,
    optionsTestUsers,
    optionsPersona,
    tests,
    customTests,
    testsKey,
    challenges,
    errorTests,
    errorChallenges,
    contestsInfo,
    testsInfo,
    assignedTests,
    assignedTestsKey,
    assignedChallenges,
    assignedChallengesKey,
    listContestsKey,
    listChallengesKey,
    assignedTestInfo,
    testReportDetails,
    testReportInfo,
    testReportUser,
    testsUserStats,
    testAssignmentsStats,
    testSkillsStats,
    leaderBoard,
    testPieData,
    generateErrorTestsOnBadRequest,
    createTests,
    updateTests,
    deleteTests,
    deleteAddedChallenge,
    fetchContests,
    fetchPersona,
    fetchSkills,
    fetchUsersTests,
    fetchTestReportDetails,
    fetchTestReportInfo,
    fetchTestReportUsers,
    fetchTopTestAssignments,
    fetchTopTestSkills,
    fetchTopTestUsers,
    fetchContestsPaginated,
    fetchTests,
    attachChallenge,
    fetchAssignedChallenges,
    fetchTestsPaginated,
    fetchChallenges,
    searchContests,
    createContests,
    updateContests,
    deleteContests,
    fetchTestsInfo,
    resetChallenges,
    errorMsgResetTests,
    clearTests,
    fetchReport
  }
})
