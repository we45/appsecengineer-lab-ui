<template>
  <div class="column items-center justify-center">
    <q-img :ratio="1" src="~assets/maintenance.jpg" width="500px" />
    <h5 class="q-my-none text-h4 text-red">This site will be down for maintenance until Monday, December 12th</h5>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'maintenance',
  created() {
    LocalStorage.clear()
    LocalStorage.remove('startTime')
    LocalStorage.remove('expTime')
    LocalStorage.remove('isOwasp')
    LocalStorage.remove('token')
    LocalStorage.remove('rtoken')
    LocalStorage.remove('user')
    LocalStorage.remove('provisionInfo')
    LocalStorage.remove('is_admin')
    LocalStorage.remove('trial')
    LocalStorage.remove('EXPIRED_TIME')
    LocalStorage.remove('userId')
    LocalStorage.remove('sub_')
  }
}
</script>
