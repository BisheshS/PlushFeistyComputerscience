import type { NextPage } from 'next'
import LegalPage from '../../components/flip/LegalPage'
import { flipTerms } from '../../lib/flipLegal'

const Page: NextPage = () => (
  <LegalPage
    doc={flipTerms}
    description="Flip Terms of Use: not medical advice, exercise safely, and how Flip Pro subscriptions work."
  />
)

export default Page
