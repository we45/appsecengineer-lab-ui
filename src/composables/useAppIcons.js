import { useQuasar } from 'quasar'
const lightIconPath = 'svguse:/svg/light'
const icons = {
  'app:dashboard': `${lightIconPath}/dashboard.svg#dashboard | 0 0 22 23`,
  'app:course': `${lightIconPath}/course.svg#course | 0 0 25 24`,
  'app:live-event': `${lightIconPath}/live-event.svg#live-event | 0 0 25 24`,
  'app:challenge': `${lightIconPath}/challenge.svg#challenge | 0 0 25 24`,
  'app:playground': `${lightIconPath}/playground.svg#playground | 0 0 23 22`,
  'app:running-lab': `${lightIconPath}/running-lab.svg#running-lab | 0 0 21 20`,
  'app:about': `${lightIconPath}/about.svg#about | 0 0 17 16`,
  'app:users': `${lightIconPath}/users.svg#users | 0 0 21 20`,
  'app:teams': `${lightIconPath}/teams.svg#teams |0 0 23 22`,
  'app:reports': `${lightIconPath}/reports.svg#reports |0 0 23 22`,
  'app:assignments': `${lightIconPath}/assignments.svg#assignments |0 0 23 22`,
  'app:tests': `${lightIconPath}/tests.svg#tests |0 0 29 28`,
  'app:administrators': `${lightIconPath}/administrators.svg#administrators |0 0 19 18`,
  'app:admin': `${lightIconPath}/admin.svg#admin |0 0 27 26`,
  'app:video': `${lightIconPath}/video.svg#video |0 0 20 14`,
  'app:menu': `${lightIconPath}/menu.svg#menu |0 0 11 9`,
  'app:google': `${lightIconPath}/google.svg#google |0 0 48 48`,
  'app:heart': `${lightIconPath}/heart.svg#heart |0 0 17 17`,
  'app:no-wishlist': `${lightIconPath}/no-wishlist.svg#noWishlist
 |0 0 40 50`,
  'app:no-wishlist-dark': `${lightIconPath}/no-wishlist-dark.svg#noWishlistDark
 |0 0 40 50`
}
export default function useAppIcons() {
  const $q = useQuasar()
  $q.iconMapFn = (icon) => {
    if (icons[icon]) {
      return { icon: icons[icon] }
    }
    const iconDetails = icon.trim().split(':')
    if (iconDetails.length > 1) {
      const iconType = iconDetails[0]
      let iconName = iconDetails[1].includes('|') ? iconDetails[1].split('|')[0].trim() : iconDetails[1]
      if (iconType === 'app') {
        return { icon: `${lightIconPath}/${iconName}.svg#${iconDetails[1]}` }
      }
    }
  }
}
