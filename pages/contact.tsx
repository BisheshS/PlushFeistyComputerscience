import type { NextPage } from 'next'
import BigPage from '../components/BigPage'

const Contact: NextPage = () => (
  <BigPage
    title="Contact Us | puchka"
    description="Contact us for any inquiries or feedback."
    kicker="Contact Us"
    headline="Say hi."
    lede="If you have any inquiries or feedback, feel free to reach out to us!"
    cta={{ href: 'mailto:bishesh@puchka.in', label: 'bishesh@puchka.in', cursor: 'mail' }}
  />
)

export default Contact
