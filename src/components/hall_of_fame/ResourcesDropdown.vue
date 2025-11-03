<template>
  <q-btn-dropdown no-caps flat class="text-black smaller-text" label="Resources">
    <template v-slot:dropdown-icon>
      <q-icon name="arrow_drop_down"></q-icon>
    </template>
    <div class="q-pa-lg flex">
      <div class="flex">
        <div>
          <p class="avenir-bold text-h5 q-mb-xs">E-books</p>
          <template v-for="(ebook, index) in ebooks" :key="index">
            <a :href="ebook.link" target="_blank">
              <q-img :src="ebook.img" width="135px" :alt="'E-book ' + (index + 1)" />
            </a>
            <a :href="ebook.link" target="_blank">
              <p class="avenir-bold" v-html="ebook.title"></p>
            </a>
          </template>
        </div>

        <div class="q-ml-lg">
          <p class="avenir-bold text-h5">Latest</p>
          <template v-for="(latest, index) in latest" :key="index">
            <a :href="latest.link" target="_blank">
              <q-img :src="latest.img" width="135px" :alt="'Latest ' + (index + 1)" />
              <p class="avenir-bold" v-html="latest.title"></p>
            </a>
          </template>
        </div>
      </div>

      <div class="q-ml-xl blog-section">
        <p class="avenir-bold text-h5">Blog</p>
        <div class="flex q-gutter-x-lg">
          <template v-for="(blog, index) in blogs" :key="index">
            <a :href="blog.link" target="_blank">
              <div class="flex">
                <q-img class="q-mr-sm" :src="blog.img" fit="contain" :alt="'Blog ' + (index + 1)" width="60px" />
                <div>
                  <p class="avenir-bold q-mb-none">{{ blog.title }}</p>
                  <p v-html="blog.description"></p>
                </div>
              </div>
            </a>
          </template>
          <q-btn
            flat
            no-caps
            text-color="white"
            size="1.1rem"
            class="browse-all-btn bg-teal-13 avenir-bold"
            label="View All"
            to="https://www.appsecengineer.com/main-menu-pages/blogs"
          />
        </div>
      </div>
    </div>

    <div class="q-px-lg">
      <p class="avenir-bold text-h5">Case Studies</p>
      <div class="flex q-gutter-xl">
        <template v-for="(caseStudy, index) in caseStudies" :key="index">
          <div class="case-study-column">
            <div class="flex align-center q-gutter-md">
              <q-img :src="caseStudy.img" :alt="'Case Study ' + (index + 1)" width="60px" />
              <div class="case-study-text">
                <p class="avenir-bold" v-html="caseStudy.description"></p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script setup>
const ebooks = [
  {
    link: 'https://www.appsecengineer.com/e-books/the-zero-trust-security-handbook',
    img: '/hall_of_fame_img/ebook1.png',
    title: 'The Zero Trust<br/>Security<br/>Handbook'
  },
  {
    link: 'https://www.appsecengineer.com/e-books/the-ultimate-guide-to-building-security-champions',
    img: '/hall_of_fame_img/ebook2.png',
    title: 'Building Security<br/>Champions'
  }
]

const latest = [
  {
    link: 'https://www.appsecengineer.com/blog/how-to-protect-healthcare-data-in-a-multi-cloud-environment',
    img: '/hall_of_fame_img/Latest2.png',
    title: 'How to Project<br/>Healthcare Data in<br/>a Multi-Cloud<br/>Enviroment'
  },
  {
    link: 'https://www.appsecengineer.com/blog/how-to-develop-software-thats-secure-by-design-7-steps-to-follow',
    img: '/hall_of_fame_img/Latest1.png',
    title: 'How to Develop<br/>Software That’s<br/>Secure by Design: 7<br/>Steps to Follow'
  }
]

const blogs = [
  {
    link: 'https://www.appsecengineer.com/main-menu-pages/blogs?blog=Container+Security',
    img: '/hall_of_fame_img/blog1.png',
    title: 'Container Security',
    description: 'Articles on building<br/>lightweight, scalable apps that<br/>stay secure under pressure'
  },
  {
    link: 'https://www.appsecengineer.com/main-menu-pages/blogs?blog=DevSecOps',
    img: '/hall_of_fame_img/blog4.png',
    title: 'DevSecOps',
    description: 'Read about security<br/>automation, CI/CD, and the<br/>best strategies to shift security<br/>left'
  },
  {
    link: 'https://www.appsecengineer.com/main-menu-pages/blogs?blog=Threat+Modeling',
    img: '/hall_of_fame_img/blog2.png',
    title: 'Threat Modeling',
    description: 'Content to help you secure<br/>every step of the SDLC, all the<br/>way from design to deployment'
  },
  {
    link: 'https://www.appsecengineer.com/main-menu-pages/blogs?blog=Kubernetes',
    img: '/hall_of_fame_img/blog5.png',
    title: 'Kubernetes Security',
    description: 'Your personal guide to<br/>securing the world’s most<br/>popular container orchestration<br/>platform'
  },
  {
    link: 'https://www.appsecengineer.com/main-menu-pages/blogs?blog=Cloud+Security',
    img: '/hall_of_fame_img/blog3.png',
    title: 'Cloud Security',
    description: 'The future is all cloud. Read<br/>these articles to stay on top of<br/>the cloud security revolution'
  },
  {
    link: 'https://www.appsecengineer.com/main-menu-pages/blogs?blog=Application+Security',
    img: '/hall_of_fame_img/blog6.png',
    title: 'Application Security',
    description: 'Attack, detect, and defend<br/>your way to secure software<br/>with these in-depth guides'
  }
]

const caseStudies = [
  {
    img: '/hall_of_fame_img/case1.png',
    description: 'Mortgage Enterprise Partners with<br/>AppSecEngineer for Security'
  },
  {
    img: '/hall_of_fame_img/case2.png',
    description: 'A New Era of AppSec Training for Energy<br/>Enterprises'
  },
  {
    img: '/hall_of_fame_img/case3.png',
    description: 'Driving Business Growth with Product Security<br/>Training'
  },
  {
    img: '/hall_of_fame_img/case4.png',
    description: 'Next-Level AppSec Training for Leading Super<br/>Apps'
  }
]
</script>

<style scoped>
.blog-section {
  width: 50%;
}

a {
  text-decoration: none;
  color: black;
}
</style>
