
export default class authStore {
    auth
    isAuthed = false
    baseUrl = "http://localhost:8100/api"

    constructor(auth) {
        this.auth = auth
    }

    login(auth) {
        this.auth = auth
        this.isAuthed = true
    }

    logout() {
        this.auth = null
        this.isAuthed = false
    }
}
