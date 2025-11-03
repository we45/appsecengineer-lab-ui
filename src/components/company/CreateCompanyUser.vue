<template>
  <q-form greedy @submit="onSubmit()">
    <div class="q-pa-none q-ma-none">
      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-md-6 col-12">
          <AseInput autofocus label="First Name *" :maxLength="50" required :rules="shortName" v-model="firstName" />
          <p v-if="errorMsgsUser.first_name" class="text-caption text-negative">{{ errorMsgsUser.first_name_msg }}</p>
        </div>
        <div class="col-md-6 col-12">
          <AseInput label="Last Name *" :maxLength="50" required :rules="shortName" v-model="lastName" />
          <p v-if="errorMsgsUser.last_name" class="text-caption text-negative">{{ errorMsgsUser.last_name_msg }}</p>
        </div>
        <div class="col-md-6 col-12">
          <AseInput label="Email *" required type="email" :rules="emailRule" v-model="email" />
          <p v-if="errorMsgsUser.email" class="text-caption text-negative">{{ errorMsgsUser.email_msg }}</p>
        </div>
        <q-item v-for="companyField in companyFieldsArray" class="col-md-6 col-12" :key="companyField.key">
          <q-item-section>
            <AseQSelect
              v-if="companyField.keydropdown === 'Dropdown'"
              :label="companyField.key + ' *'"
              :options="companyField.values_list"
              v-model="companyField.value"
              :rules="[(val) => val?.length || `${companyField.key} is required`]"
            />
            <AseInput
              v-if="companyField.keydropdown === 'Text'"
              :maxLength="50"
              :label="companyField.key + ' *'"
              required
              :rules="shortName"
              v-model="companyField.value"
            />
            <p v-if="errorMsgsUser[companyField.key] && !companyField.value" class="text-caption text-negative">
              {{ errorMsgsUser[companyField.key + '_msg'] }}
            </p>
          </q-item-section>
        </q-item>
      </div>

      <InfoListItem class="q-mt-md" text="* Once user is created it cannot be Modified or Deleted. Please fill the details carefully." />
    </div>
    <div class="q-gutter-x-sm text-right">
      <AseButton color="primary" label="Cancel" @click="onCancel()" />
      <AseButton variant="secondary" label="Submit" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import InfoListItem from 'components/common/InfoListItem.vue'
import { email as emailRule, shortName } from 'src/utils/rules'
import { loader } from 'src/utils/helpers'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

defineOptions({ name: 'CreateCompanyUserInfo' })

const props = defineProps(['id', 'courseId', 'subjectId', 'dynamicFields'])
const emit = defineEmits(['onCancel', 'onCacel'])

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const companyFieldsArray = ref([])
const user = ref({})

const $q = useQuasar()
const companyUsersStore = useCompanyConsumerStore()

const getStatusCreateUserAPI = computed(() => companyUsersStore.statusOfUserAPI)
const errorMsgsUser = computed(() => companyUsersStore.errorCompanyUser)

onMounted(() => {
  companyFieldsArray.value = props.dynamicFields
})

async function onSubmit() {
  const data = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value
  }
  companyFieldsArray.value.map((dataField) => (data[dataField.key] = dataField.value))
  $q.loading.show(loader({}))
  await companyUsersStore.createNewUser(data)
  user.value = {}
  if (getStatusCreateUserAPI.value) {
    onCancel()
  }
  $q.loading.hide()
}

function onCancel() {
  user.value = {}
  const err_msgs = { first_name: false, first_name_msg: '', last_name: false, last_name_msg: '', email: false, email_msg: '' }
  companyUsersStore.errorMsgReset(err_msgs)
  emit('onCancel', { show: true })
}
</script>

<style scoped></style>
