<template>
  <q-layout view="hHr lpR fFf">
    <!-- Navbar -->
    <NavBar />

    <q-page-container>
      <!-- Header card -->
      <div class="q-pa-lg q-mx-auto">
        <section>
          <div class="achievment-card row basic-shadow q-mt-md q-py-md q-px-lg" style="position: relative">
            <div class="q-pa-lg col-sm-12 col-md-6">
              <q-img src="/Hall_Off_Fame.png" style="width: 8.5rem" />

              <h6 class="font-paytone q-mt-xs q-mb-lg text-bold" style="font-size: 3.5rem; line-height: 3.75rem; max-width: 35rem">
                AppSec Engineer Hall Of Fame
              </h6>

              <p class="q-py-md" style="font-size: 1.2rem">
                Welcome to our Hall of Fame, where we honor outstanding individuals who have made significant contributions to our
                community. This prestigious recognition celebrates their dedication, hard work, and exceptional achievements. Each inductee
                has left a lasting impact, inspiring others to strive for excellence.
              </p>

              <CertifiedButton />
            </div>

            <div class="col-sm-12 col-md-6 q-pt-xl">
              <q-img src="/hall-of-fame-map.png" />
            </div>
          </div>
        </section>

        <!-- Hall of Fame -->
        <section class="row q-mx-xl q-mt-xl q-pt-xl q-ml-md">
          <div class="font-paytone col-sm-12 q-mx-auto col-md-7 text-h3">
            <span>Recognizing Excellence in Certified Course Completion</span>
          </div>

          <div class="col-sm-12 col-md-4 q-pt-md align-center items-center justify-center text-center">
            <CertifiedButton />
          </div>
        </section>

        <!-- Hall of Fame Users -->
        <div v-if="certificationsStore.hallOfFameUsers?.length === 0" class="hall-of-fame">
          <div v-for="i in 6" :key="i">
            <q-card class="hall-of-fame-card">
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" animation="fade" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" width="70%" animation="fade" />
                    <q-skeleton type="text" width="40%" animation="fade" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-card-section>
                <q-skeleton type="text" width="90%" animation="fade" />
                <q-skeleton type="text" width="90%" animation="fade" />
                <q-skeleton type="text" width="90%" animation="fade" />
                <q-skeleton type="text" width="90%" animation="fade" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else class="hall-of-fame">
          <div v-for="(user, index) in certificationsStore.hallOfFameUsers" :key="index">
            <q-card class="hall-of-fame-card">
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="80px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <p class="q-mb-sm avenir-bold" style="font-size: 1.375rem">{{ user.first_name }} {{ user.last_name }}</p>
                  </q-item-label>
                  <q-item-label caption>
                    <p class="q-mb-sm" style="font-size: 1rem">{{ user.role }}</p>
                    <span style="font-size: 1rem">{{ user.country }}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-card-section>
                <span class="avenir-bold text-teal-13" style="font-size: 1rem">
                  <q-icon name="verified" />
                  APPSECENGINEER'S EXCLUSIVE
                </span>

                <p class="q-mb-none q-mt-sm text-capitalize" style="font-size: 1.125rem">{{ user.certification_name }}</p>
                <p class="q-my-sm" style="font-size: 1rem">
                  <span class="avenir-bold">Grant date:</span>
                  {{ date.formatDate(user.issueDate, 'MMMM DD, YYYY') }}
                </p>
                <p class="q-mb-none" style="font-size: 1rem">
                  <span class="avenir-bold">Expiration date:</span>
                  {{ date.formatDate(date.addToDate(user.issueDate, { years: 2 }), 'MMMM DD, YYYY') }}
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Footer -->
        <section class="relative-position" style="margin-top: 240px">
          <div class="footer-card flex justify-center q-mt-xl absolute z-fab full-width" style="top: -180px">
            <q-card class="q-py-lg" style="width: 90rem; max-width: 90vw">
              <q-img class="absolute" src="/hall_of_fame_img/footer-card-detail.png" width="10rem" style="top: -3rem; left: 2rem" />
              <q-img
                class="absolute card-detail"
                src="/hall_of_fame_img/footer-card-detail-ball.png"
                width="5rem"
                style="left: 87.5rem; top: 8rem"
              />
              <q-card-section class="flex-column text-center">
                <p class="font-paytone text-h2" style="font-size: 3.5rem">Want to be included in the hall of fame?</p>
                <CertifiedButton />
              </q-card-section>
              <q-img
                class="absolute card-detail"
                src="/hall_of_fame_img/footer-card-detail-star.png"
                width="4.5rem"
                style="left: 80rem; top: 10.5rem"
              />
            </q-card>
          </div>

          <div class="row footer-main-card q-px-xl" style="padding-top: 180px">
            <div class="col-sm-12 col-md-3 q-pb-md">
              <q-img src="/favicon_dark.svg/" width="150px" />
              <q-img
                class="absolute card-detail"
                src="/hall_of_fame_img/footer-card-detail-ball.png"
                width="5.5rem"
                style="top: 23rem; left: -3rem"
              />
              <q-img
                class="absolute card-detail"
                src="/hall_of_fame_img/footer-detail-star.png"
                width="5.5rem"
                style="top: 22rem; left: 10rem"
              />
              <q-img
                class="absolute card-detail"
                src="/hall_of_fame_img/footer-detail-triangle.png"
                width="4.5rem"
                style="top: 33rem; left: 9rem"
              />
            </div>
            <div class="col-sm-12 col-md-3">
              <p class="avenir-bold text-deep-purple-13" style="font-size: 18px">SITEMAP</p>
              <div class="column">
                <span><a href="https://www.appsecengineer.com/" class="text-white no-underline">Home</a></span>
                <span>
                  <a href="https://www.appsecengineer.com/main-menu-pages/course-catalog" class="text-white no-underline">
                    Training Library
                  </a>
                </span>
                <span>
                  <a href="https://www.appsecengineer.com/main-menu-pages/teams" class="text-white no-underline">For Businesses</a>
                </span>
                <span>
                  <a href="https://www.appsecengineer.com/main-menu-pages/platform/experience" class="text-white no-underline">
                    Hands-on Labs
                  </a>
                </span>
                <span><a href="https://www.appsecengineer.com/pricing" class="text-white no-underline">Pricing</a></span>
                <span><a href="https://www.appsecengineer.com/main-menu-pages/blogs" class="text-white no-underline">Blog</a></span>
              </div>
            </div>
            <div class="quick-links column q-gutter-y-xs col-sm-12 col-md-3">
              <p class="avenir-bold text-deep-purple-13" style="font-size: 18px">QUICK LINKS</p>
              <span><a href="https://learning.appsecengineer.com/" class="text-white no-underline">Sign In</a></span>
              <span><a href="https://www.appsecengineer.com/pricing" class="text-white no-underline">Sign Up</a></span>
              <span>
                <a href="https://www.appsecengineer.com/privacy-policy" class="text-white no-underline">Privacy Policy</a>
              </span>

              <p class="avenir-bold text-deep-purple-13 q-mt-lg" style="font-size: 18px">E-BOOKS</p>
              <span>
                <a
                  href="https://www.appsecengineer.com/e-books/e-book-a-beginners-guide-to-careers-in-appsec"
                  class="text-white no-underline"
                >
                  Beginner's Guide to
                  <br />
                  a Career in AppSec
                </a>
              </span>
              <span>
                <a href="https://www.appsecengineer.com/e-books/e-book-train-your-teams-to-fly" class="text-white no-underline">
                  Train your Teams to Fly
                </a>
              </span>
            </div>
            <div class="col-sm-12 col-md-3">
              <p class="avenir-bold text-deep-purple-13" style="font-size: 18px">FOLLOW APPSECENGINEER</p>
              <div class="flex q-gutter-x-md">
                <a href="https://www.youtube.com/@AppSecEngineer" target="_blank">
                  <img src="/icons/youtube.svg" alt="Youtube" />
                </a>
                <a href="https://www.linkedin.com/company/appsecengineer/" target="_blank">
                  <img src="/icons/linkedin.svg" alt="Linkedlin" />
                </a>
                <a href="https://x.com/AppSecEngineer" target="_blank">
                  <img src="/icons/twitter.svg" alt="Twitter" />
                </a>
                <a href="https://www.instagram.com/appsecengineer/" target="_blank">
                  <img src="/icons/instagram.png" alt="instagram" />
                </a>
                <a href="https://www.tiktok.com/@appsecengineer" target="_blank">
                  <img src="/icons/tiktok.svg" alt="TikTok" />
                </a>
              </div>

              <p class="avenir-bold text-deep-purple-13 q-mt-sm" style="font-size: 18px">CONTACT</p>
              <p>Contact Support</p>
              <p>>help@appsecengineer.com</p>
              <p style="max-width: 150px">1603 Capitol Avenue, Suite 413A #2898, Cheyenne, Wyoming 82001, United States</p>
            </div>
            <div class="text-center q-pt-lg col-12">
              <q-separator />
              <p class="q-pt-md">Copyright AppSecEngineer ©️ 2023</p>
            </div>
          </div>
        </section>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { date } from 'quasar'
import CertifiedButton from 'src/components/hall_of_fame/CertifiedButton.vue'
import NavBar from 'src/components/hall_of_fame/NavBar.vue'
import { useCertificationsStore } from 'src/store/pinia/certifications/certifications'
import { onMounted } from 'vue'

const certificationsStore = useCertificationsStore()

onMounted(async () => {
  await certificationsStore.getHallOfFameCertificates()
})
</script>

<style lang="scss" scoped>
.hall-of-fame {
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-columns: 1fr;
  margin: 20px 40px 60px 40px;
  display: grid;
  padding: 0 70px;
}

.hall-of-fame-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.06);
}

.achievment-card {
  background-color: $night-blue;
  border-radius: 0.8rem;
  position: relative;
  color: white;
  max-width: 85vw;
  margin: 0 auto;
}

.footer-main-card {
  background-size: contain;
  background-repeat: no-repeat;
  background-color: $night-blue;
  border-radius: 0.8rem;
  position: relative;
  color: white;
  margin: 0 auto;
}

a.no-underline {
  text-decoration: none;
}

.hide-on-mobile {
  display: none;
}
@media (min-width: 1024px) {
  .hide-on-mobile {
    display: flex;
  }
  .hide-on-large-and-up {
    display: none;
  }
}

@media (max-width: 720px) {
  .hall-of-fame {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
  }

  .achievment-card h6 {
    max-width: 50vw;
    font-size: 2.6rem !important;
  }

  .footer-card p {
    font-size: 2rem !important;
    width: 100% !important;
    padding: 0 !important;
  }

  .card-detail {
    display: none;
  }
}
</style>
