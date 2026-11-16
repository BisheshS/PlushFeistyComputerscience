import type { NextPage } from 'next'
import BigPage from '../components/BigPage'

const NotFound: NextPage = () => (
  <BigPage
    title="Page not found | puchka"
    noindex
    kicker="404"
    headline="Not here."
    lede="This page is not here."
    cta={{ href: '/', label: 'Go back to Home', cursor: 'home' }}
  />
)

export default NotFound
