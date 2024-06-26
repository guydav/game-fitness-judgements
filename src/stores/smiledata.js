import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import appconfig from '@/config'
import gamesDataJson from '../../data/games.json';

import {
  createDoc,
  updateSubjectDataRecord,
  updateExperimentCounter,
  balancedAssignConditions,
  loadDoc,
  fsnow,
} from './firestore-db'

function initLastRoute(mode) {
  if (mode === 'development') {
    return 'recruit'
  }
  
  if (mode === 'presentation') {
    return 'presentation_home'
  }

  return 'landing'
}

function initAllowJumps(mode) {
  return mode === 'development' || mode === 'presentation'
}

const useSmileStore = defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(
      appconfig.local_storage_key,
      {
        // syncs with local storage
        knownUser: false,
        lastRoute: initLastRoute(appconfig.mode),
        allowJumps: initAllowJumps(appconfig.mode),
        docRef: null,
        partNum: null,
        completionCode: '',
        totalWrites: 0,
        lastWrite: null,
        seedActive: true, // do you want to use a random seed based on the participant's ID?
        seedID: '',
        seedSet: false,
        pageTracker: 0,
        // possibleConditions: { "task": ["single", "paired"] },
        gamesData: null,
      },
      localStorage,
      { mergeDefaults: true }
    ),
    global: {
      // ephemeral state, resets on browser refresh
      progress: 0,
      page_bg_color: '#fff',
      page_text_color: '#000',
      status_bar_bg_color: '#fff',
      status_bar_text_color: '#000',
      db_connected: false,
      search_params: null,
    },
    dev: {
      // ephemeral state, utilized by developer mode functions
      page_provides_autofill: null,
    },
    data: {
      // syncs with firestore
      trial_num: 0, // not being updated correctly
      consented: false,
      done: false,
      starttime: null, // time consented
      endtime: null, // time finished or withdrew
      recruitment_service: 'web', // fake
      recruitment_info: {}, // empty
      browser_fingerprint: {}, // empty
      browser_data: [], // empty
      demographic_form: {}, // empty
      withdraw: false, // false
      withdraw_data: {}, // empty
      route_order: [],
      conditions: {},
      smile_config: appconfig, //  adding config info to firebase document
      single_game_results: [],
      paired_game_results: [],
      quiz_form: [], // array of quiz attempts
      quiz_attempts: 0,
      quiz_passed: false,
      n_real_games: 3,
      n_novel_games: 4,
      debrief_responses: {},
      timestamps: {},
    },
    config: appconfig,
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    isConsented: (state) => state.data.consented,
    isDone: (state) => state.data.done,
    lastRoute: (state) => state.local.lastRoute,
    isDBConnected: (state) => state.global.db_connected,
    hasAutofill: (state) => state.dev.page_provides_autofill,
    searchParams: (state) => state.global.search_params,
    recruitmentService: (state) => state.data.recruitment_service,
    isSeedSet: (state) => state.local.seedSet,
    getSeedID: (state) => state.local.seedID,
    getPage: (state) => state.local.pageTracker,
    getPossibleConditions: (state) => state.local.possibleConditions,
    getConditions: (state) => state.data.conditions,
    getSingleGameResults: (state) => state.data.single_game_results,
    getPairedGameResults: (state) => state.data.paired_game_results,
    getGamesData: (state) => state.local.gamesData,
    getQuizAttempts: (state) => state.data.quiz_attempts,
    getQuizForm: (state) => state.data.quiz_form,
    getNRealGames: (state) => state.data.n_real_games,
    getNNovelGames: (state) => state.data.n_novel_games,
  },

  actions: {
    setDBConnected() {
      this.global.db_connected = true
    },
    setSearchParams(search_params) {
      this.global.search_params = search_params
    },
    setConsented() {
      this.data.consented = true
      this.data.starttime = fsnow()
      this.recordTimestamp('consent')
    },
    setWithdraw(forminfo) {
      this.data.withdraw = true
      this.data.withdraw_data = forminfo
      this.data.endtime = fsnow()
    },
    setDone() {
      this.data.done = true
      this.data.endtime = fsnow()
    },
    setCompletionCode(code) {
      this.local.completionCode = code
    },
    setSeedID(seed) {
      this.local.seedID = seed
      this.local.seedSet = true
    },
    incrementPageTracker() {
      this.local.pageTracker += 1
      return this.local.pageTracker
    },
    resetPageTracker() {
      this.local.pageTracker = 0
    },
    recordWindowEvent(type, event_data = null) {
      if (event_data) {
        this.data.browser_data.push({
          event_type: type,
          timestamp: fsnow(),
          event_data,
        })
      } else {
        this.data.browser_data.push({
          event_type: type,
          timestamp: fsnow(),
        })
      }
    },
    getBrowserFingerprint() {
      if (this.data.browser_fingerprint && Object.keys(this.data.browser_fingerprint).length > 0) {
        return this.data.browser_fingerprint;
      }

      // this is not "real" browser fingerprinting, but it's close enough for our purposes
      // it just finds things like browser version, OS, and IP address of user
      // which can be helpful for debugging purposes
      let ip = 'unknown'
      // Make a request for a user with a given ID
      axios
        .get('https://api.ipify.org/?format=json')
        .then((response) => {
          // handle success
          console.log('ip address', response.data)
          // check if ip field exists
          if (response.data.ip) {
            ip = response.data.ip
          }
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
        .finally(() => {
          // always executed
          const { language } = window.navigator
          const { webdriver } = window.navigator
          const { userAgent } = window.navigator
          this.setFingerPrint(ip, userAgent, language, webdriver)
        })
      
      return this.data.browser_fingerprint;
    },
    setFingerPrint(ip, userAgent, language, webdriver) {
      this.data.browser_fingerprint = {
        ip,
        userAgent,
        language,
        webdriver,
      }
      console.log(this.data.browser_fingerprint)
    },
    setPageAutofill(fn) {
      this.dev.page_provides_autofill = fn
    },
    removePageAutofill() {
      this.dev.page_provides_autofill = null
    },
    setRecruitmentService(service, info) {
      this.data.recruitment_service = service
      this.data.recruitment_info = info
    },
    autofill() {
      if (this.dev.page_provides_autofill) {
        this.dev.page_provides_autofill()
      }
    },
    saveDemographicForm(data) {
      this.data.demographic_form = data
    },
    setCondition(name, cond) {
      this.data.conditions[name] = cond
    },
    async setKnown() {
      this.local.knownUser = true
      this.local.partNum = await updateExperimentCounter('participants')
      this.local.docRef = await createDoc(this.data, this.local.seedID, this.local.partNum)
      // if possible conditions are not empty, assign conditions
      if (this.local.possibleConditions) {
        this.data.conditions = await balancedAssignConditions(this.local.possibleConditions, this.data.conditions)
      }
      if (this.local.docRef) {
        this.setDBConnected()
        // force a data save so conditions get added to the data right away
        this.saveData(true)
      }
      return this.data.conditions
    },
    async loadData() {
      let data
      if (this.local.docRef) {
        data = await loadDoc(this.local.docRef)
      }
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          this.data[key] = value;
        });
        this.setDBConnected()
      }
    },
    setLastRoute(route) {
      this.local.lastRoute = route
      // if (route !== 'config') {
      //   this.local.lastRoute = route
      // }
    },
    recordRoute(route) {
      this.data.route_order.push(route)
    },
    async saveData(force = false) {
      if (this.isDBConnected) {
        if (!force && this.local.totalWrites >= appconfig.max_writes) {
          console.error(
            'SMILESTORE: max writes reached to firebase.  Data NOT saved.  Call saveData() less numerously to avoid problems/cost issues.'
          )
          return
        }

        if (!force && this.local.lastWrite && Date.now() - this.local.lastWrite < appconfig.min_write_interval) {
          console.error(
            'SMILESTORE: write interval too short for firebase.  Data NOT saved. Call saveData() less frequently to avoid problems/cost issues.'
          )
          console.error('SMILESTORE: interval was', appconfig.min_write_interval)
          // console.error(Date.now() - this.local.lastWrite)
          return
        }
        updateSubjectDataRecord(this.data, this.local.docRef)
        this.local.totalWrites += 1
        this.local.lastWrite = Date.now()
        console.log('Request to firebase successful')
      }
    },
    resetLocal() {
      // this.local.knownUser = false
      // this.local.lastRoute = 'welcome'
      // this.local.allowJumps = false
      // this.global.db_connected = false
      this.$reset()
    },
    recordSingleGameResults(results) {
      this.data.single_game_results.push(results);
    },
    recordPairedGameResults(results) {
      this.data.paired_game_results.push(results);
    },
    recordDebriefResponses(responses) {
      this.data.debrief_responses = responses;
      this.recordTimestamp('debrief');
    },
    loadGamesData() {
      if (this.local.gamesData === null) {
        this.local.gamesData = gamesDataJson;
        const lengths = Object.keys(this.local.gamesData).map((key) => `${key} (${Object.keys(this.local.gamesData[key]).length})`).join(', '); // => `a (1), b (2), c (3
        console.log(`gamesData loaded from json with keys (and lengths): ${lengths}`);
      }

      return this.local.gamesData;
    },
    incrementQuizAttempts(){
      this.data.quiz_attempts += 1;
    },
    recordQuizPasssed() {
      this.data.quiz_passed = true;
    },
    saveQuizForm(data) {
      this.data.quiz_form.push(data);
    },
    recordTimestamp(name) {
      this.data.timestamps[name] = fsnow();
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSmileStore, import.meta.hot))
}

export default useSmileStore;
