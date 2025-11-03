<template>
  <q-header class="nav-bar bg-grey-6 q-mx-auto">
    <q-toolbar class="justify-between">
      <img src="/appsec_logo_light.svg" alt="Logo" class="logo" />
      <div class="menu-buttons flex">
        <div class="bg-grey-11" style="border-radius: 1rem">
          <MenuDropdown label="Business" :items="businessItems" header="For Business (Teams)" />
          <MenuDropdown label="Individual" :items="individualItems" :extraButton="true" />
        </div>

        <TrainingLibraryDropdown :items="trainingLibraryItems" />

        <MenuDropdown label="Platform" :items="platformItems" />

        <q-btn
          flat
          no-caps
          class="text-black smaller-text"
          label="Live Training"
          to="https://www.appsecengineer.com/instructor-led-training"
        />
        <q-btn flat no-caps class="text-black smaller-text" label="Events" href="https://www.we45.com/events" target="_blank" />
        <q-btn flat no-caps class="text-black smaller-text" label="Pricing" href="https://www.appsecengineer.com/pricing" target="_blank" />

        <ResourcesDropdown />

        <div class="bg-grey-11" style="border-radius: 1rem">
          <q-btn
            flat
            no-caps
            rounded
            class="text-black smaller-text"
            label="Log In"
            to="https://learning.appsecengineer.com"
            target="_blank"
          />
          <q-btn
            flat
            no-caps
            rounded
            class="text-black smaller-text"
            label="Sign Up"
            to="https://www.appsecengineer.com/business-verticals/appsecengineer-for-manufacturing#"
            target="_blank"
          />
        </div>
      </div>

      <!-- Responsiveness -->
      <q-btn class="menu-icon" flat round icon="menu" color="black">
        <q-menu v-model="drawer" side="right" overlay>
          <q-list>
            <div class="column">
              <MenuDropdown label="Business" :items="businessItems" header="For Business (Teams)" />
              <MenuDropdown label="Individual" :items="individualItems" :extraButton="true" />

              <TrainingLibraryDropdown :items="trainingLibraryItems" />

              <MenuDropdown label="Platform" :items="platformItems" />

              <q-btn
                flat
                no-caps
                class="text-black smaller-text"
                label="Live Training"
                to="https://www.appsecengineer.com/instructor-led-training"
              />
              <q-btn flat no-caps class="text-black smaller-text" label="Events" href="https://www.we45.com/events" target="_blank" />
              <q-btn
                flat
                no-caps
                class="text-black smaller-text"
                label="Pricing"
                href="https://www.appsecengineer.com/pricing"
                target="_blank"
              />

              <ResourcesDropdown />

              <q-btn
                flat
                no-caps
                rounded
                class="text-black smaller-text"
                label="Log In"
                to="https://learning.appsecengineer.com"
                target="_blank"
              />
              <q-btn
                flat
                no-caps
                rounded
                class="text-black smaller-text"
                label="Sign Up"
                to="https://www.appsecengineer.com/business-verticals/appsecengineer-for-manufacturing#"
                target="_blank"
              />
            </div>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'
import MenuDropdown from './MenuDropdown.vue'
import ResourcesDropdown from './ResourcesDropdown.vue'
import TrainingLibraryDropdown from './TrainingLibraryDropdown.vue'

const drawer = ref(false)

const trainingLibraryItems = [
  {
    name: 'course_collections',
    title: 'Course Collections',
    description: 'Pick your specialty & go from novice to expert in 30 days',
    img: '/hall_of_fame_img/Course_Collections.png'
  },
  {
    name: 'learning',
    title: 'Learn by doing',
    description: 'Hands-on skills with 700+ labs & cyber-ranges',
    img: '/hall_of_fame_img/Learn_by_doing.png'
  },
  { name: 'courses', title: 'Courses', description: 'Build security skills for everyone in the team', img: '/hall_of_fame_img/Courses.png' }
]

const platformItems = [
  {
    img: '/hall_of_fame_img/Overview.png',
    title: 'Overview',
    description: "Get a bird's eye of our platform and take your InfoSec training to the next level",
    link: 'https://www.appsecengineer.com/platform-overview'
  },
  {
    img: '/hall_of_fame_img/cloud.png',
    title: 'Cloud Sandboxes',
    description: 'Try out all those new skills in a risk-free environment, all on your browser',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/cloud-sandboxes'
  },
  {
    img: '/hall_of_fame_img/Challenges.png',
    title: 'Challenges',
    description: 'Put all those awesome new skills to the test with challenges in Kubernetes, AWS & AppSec',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/challenges'
  },
  {
    img: '/hall_of_fame_img/learning-paths.png',
    title: 'Learning Paths',
    description: 'Specialize in any of the 10 domains of security that best suits your needs',
    link: 'https://www.appsecengineer.com/main-menu-pages/course-catalog'
  },
  {
    img: '/hall_of_fame_img/labs.png',
    title: 'Hands-on Labs',
    description: 'Learn by doing, with over 800 Hands-on labs',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/experience'
  },
  {
    img: '/hall_of_fame_img/Playgrounds.png',
    title: 'Playgrounds',
    description: 'Spin up secure playgrounds in just a few clicks and work in real world security scenarios',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/playgrounds'
  },
  {
    img: '/hall_of_fame_img/Assessments.png',
    title: 'Assessments',
    description: 'Supervising organization-wide training, made ultra-simple.',
    link: 'https://www.appsecengineer.com/skills-assessments'
  },
  {
    img: '/hall_of_fame_img/certification.png',
    title: 'DevSecOps Certification',
    description: 'Become a highly sought-after DevSecOps pro',
    link: 'https://www.appsecengineer.com/devsecops-certification'
  }
]

const individualItems = [
  {
    img: '/hall_of_fame_img/Developer.svg',
    title: 'Developer',
    description: 'Learn to code securely in 7+ popular languages',
    link: 'https://www.appsecengineer.com/developers'
  },
  {
    img: '/hall_of_fame_img/Pentester.png',
    title: 'Pentester',
    description: 'Master offensive security while learning defensive techniques',
    link: 'https://www.appsecengineer.com/pentester'
  },
  {
    img: '/hall_of_fame_img/Cloud_enginer.png',
    title: 'Cloud Engineer',
    description: 'Train for the most sought-after security skills in tech',
    link: 'https://www.appsecengineer.com/cloud-engineer'
  },
  {
    img: '/hall_of_fame_img/DevOps.svg',
    title: 'DevOps',
    description: 'Speed up security processes, achieve faster releases',
    link: 'https://www.appsecengineer.com/devsecops'
  },
  {
    img: '/hall_of_fame_img/Security_Architect.png',
    title: 'Security Architect',
    description: 'Design software to be secure from the ground up',
    link: 'https://www.appsecengineer.com/security-architect'
  },
  {
    img: '/hall_of_fame_img/Security_engineer.png',
    title: 'Security Engineer',
    description: 'Learn to secure any tech stack with purple team security',
    link: 'https://www.appsecengineer.com/security-engineers'
  },
  {
    img: '/hall_of_fame_img/Security_Champion.png',
    title: 'Security Champion',
    description: 'Bring game-changing security initiatives to your team',
    link: 'https://www.appsecengineer.com/security-champions'
  }
]

const businessItems = [
  {
    img: '/hall_of_fame_img/Manufacturing.svg',
    title: 'Manufacturing',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-manufacturing'
  },
  {
    img: '/hall_of_fame_img/Healthcare.png',
    title: 'Healthcare',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-healthcare'
  },
  {
    img: '/hall_of_fame_img/Government.svg',
    title: 'Government',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-government'
  },
  {
    img: '/hall_of_fame_img/Defense.svg',
    title: 'Defense',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-defense'
  },

  {
    img: '/hall_of_fame_img/Finance.svg',
    title: 'Finance',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-finance'
  },
  {
    img: '/hall_of_fame_img/Retail.png',
    title: 'Retail',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-retail'
  },
  {
    img: '/hall_of_fame_img/Technology.svg',
    title: 'Technology',
    link: 'https://www.appsecengineer.com/business-verticals/appsecengineer-for-technology'
  }
]
</script>

<style scoped>
.nav-bar {
  border-radius: 100px;
  padding: 18px 24px;
  box-shadow: 0 0 12px -2px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 95vw;
  /* margin: 10px auto; */
}

.menu-icon {
  display: none;
}

.hide-on-mobile {
  display: flex;
}

@media (max-width: 1100px) {
  .menu-buttons {
    display: none;
  }

  .menu-icon {
    display: block;
  }

  .hide-on-mobile {
    display: none;
  }
}
</style>
