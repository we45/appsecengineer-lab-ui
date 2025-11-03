<template>
  <q-btn-dropdown no-caps flat class="text-black smaller-text" label="Training Library" style="max-width: 100% !important">
    <q-splitter disable>
      <template v-slot:before>
        <q-tabs v-model="tab" indicator-color="teal-13" vertical class="text-black" style="border: none !important">
          <q-tab v-for="item in items" :key="item.name" :name="item.name" no-caps>
            <q-item>
              <q-item-section avatar>
                <q-img :src="item.img" alt="Available Courses" width="4rem" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="avenir-bold">{{ item.title }}</q-item-label>
                <q-item-label>{{ item.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-tab>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="course_collections" style="border-bottom: none !important">
            <div class="platform-grid">
              <div class="platform-item" v-for="item in coursesItems" :key="item.title">
                <a :href="item.link"><q-img :src="item.img" alt="Item Image" width="3rem" /></a>
                <a :href="item.link">
                  <p class="avenir-bold">{{ item.title }}</p>
                </a>
              </div>
            </div>
            <q-btn flat no-caps text-color="white" class="q-mt-md bg-teal-13" label="Browse All Courses" />
          </q-tab-panel>

          <q-tab-panel name="learning" style="border: none !important">
            <div class="platform-grid-2">
              <div class="platform-item" v-for="item in learningByDoing" :key="item.title">
                <a :href="item.link">
                  <q-img :src="item.img" alt="Item Image" width="3rem" />
                </a>
                <div>
                  <a :href="item.link">
                    <span class="avenir-bold">{{ item.title }}</span>
                    <p class="text-black">{{ item.description }}</p>
                  </a>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="courses">
            <div class="platform-grid">
              <div class="platform-item" v-for="item in individualItems" :key="item.title">
                <a :href="item.link"><q-img :src="item.img" alt="Item Image" width="3rem" /></a>
                <a :href="item.link">
                  <span class="avenir-bold">{{ item.title }}</span>
                  <p class="text-black" style="min-width: 114px">{{ item.description }}</p>
                </a>
              </div>
            </div>
            <q-btn
              flat
              no-caps
              text-color="white"
              class="bg-teal-13"
              label="Browse All Courses"
              to="https://www.appsecengineer.com/main-menu-pages/course-catalog"
              target="blank"
            />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-btn-dropdown>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  items: Array
})

const tab = ref('course_collections')

const learningByDoing = [
  {
    img: '/hall_of_fame_img/labs.png',
    title: 'Hands-on Labs',
    description: 'Learn by doing, with over 800 Hands-on labs',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/experience'
  },
  {
    img: '/hall_of_fame_img/cloud.png',
    title: 'Cloud Sandboxes',
    description: 'Try out all those new skills in a risk-free environment, all on your browser',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/cloud-sandboxes'
  },
  {
    img: '/hall_of_fame_img/Playgrounds.png',
    title: 'Playgrounds',
    description: 'Spin up secure playgrounds in just a few clicks and work in real world security scenarios',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/playgrounds'
  },
  {
    img: '/hall_of_fame_img/Challenges.png',
    title: 'Challenges',
    description: 'Put all those awesome new skills to the test with challenges in Kubernetes, AWS & AppSec',
    link: 'https://www.appsecengineer.com/main-menu-pages/platform/challenges'
  },
  {
    img: '/hall_of_fame_img/Assessments.png',
    title: 'Assessments',
    description: 'Supervising organization-wide training, made ultra-simple.',
    link: 'https://www.appsecengineer.com/skills-assessments'
  },
  {
    img: '/hall_of_fame_img/certification.png',
    title: 'Coming Soon',
    description: 'New Courses, Sandboxes, Playgrounds, Challenges, Features, and so much more',
    link: 'https://www.appsecengineer.com/coming-soon'
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

const coursesItems = [
  {
    img: '/hall_of_fame_img/DevSecOps.svg',
    title: 'DevSecOps Collection',
    link: 'https://www.appsecengineer.com/devsecops-collection'
  },
  {
    img: '/hall_of_fame_img/AWS_Security_Collection.svg',
    title: 'AWS Security Collection',
    link: 'https://www.appsecengineer.com/aws-security-collection'
  },
  {
    img: '/hall_of_fame_img/Kubernetes.svg',
    title: 'Kubernetes & Containers Security Collection',
    link: 'https://www.appsecengineer.com/containers-kubernetes-security-collection'
  },
  {
    img: '/hall_of_fame_img/aws.svg',
    title: 'AWS Security Collection',
    link: 'https://www.appsecengineer.com/aws-security-collection'
  },
  {
    img: '/hall_of_fame_img/azure.svg',
    title: 'Azure Security Collection',
    link: 'https://www.appsecengineer.com/azure-security-collection'
  },
  {
    img: '/hall_of_fame_img/ai.png',
    title: 'AI & LLM Security Learning Path and Collection',
    link: 'https://www.appsecengineer.com/ai-llm-security-collection'
  },
  {
    img: '/hall_of_fame_img/modeling.svg',
    title: 'Threat Modeling Collection',
    link: 'https://www.appsecengineer.com/threat-modeling-collection'
  },
  {
    img: '/hall_of_fame_img/gcp.svg',
    title: 'GCP Security Collection',
    link: 'https://www.appsecengineer.com/gcp-security-collection'
  }
]
</script>

<style scoped>
.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 10px;
  margin: 0 auto;
}

.platform-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 10px;
  margin: 0 auto;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

a {
  text-decoration: none;
  color: black;
}
</style>
