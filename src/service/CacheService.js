export class CacheService {
  constructor(storageName) {
    this.storageName = storageName
    this.storage = null
  }

  // After creating an instance of CacheService, this open method will needs to be execute
  async open() {
    this.storage = await caches.open(this.storageName)
  }

  async add(data, pathName) {
    const res = new Response(JSON.stringify(data))
    await this.storage.put(`/${pathName}`, res)
  }

  async getIfExist(pathName) {
    const res = await this.storage.match(`/${pathName}`)
    if (!res) return false
    return await res.json()
  }

  async deleteIfExist(pathName) {
    const res = await this.storage.match(`/${pathName}`)
    if (!res) return false
    return await this.storage.delete(`/${pathName}`)
  }
}
