import type { NextPage } from 'next'
import LegalPage from '../../components/flip/LegalPage'
import { flipPrivacy } from '../../lib/flipLegal'

const Page: NextPage = () => (
  <LegalPage
    doc={flipPrivacy}
    description="Flip Privacy Policy: no accounts, no servers, no analytics. Your data stays on your iPhone."
  />
)

export default Page
