import React from 'react'
import HeroSection from '../hero/hero'
import Stats from '../stats/stats'
import Wealth from '../wealthSection/WealthSection'
import Features from '../ourFeature/ourFeature'
import OurSecurity from '../ourSecurity/ourSecurity'
import Testimonials from '../Testimonials/Testimonials'
import CallToAction from '../callToAction/callToAction'
import Footer from '../bottomNav/bottomNav'
import Sidebar from '../userDashboard/sidebar/Sidebar'
import Overview from '../userDashboard/overView/overView'
import MyProfile from '../userDashboard/MyProfile/Myprofile'
import DashboardLayout from '../userDashboard/DashboardLayout/DashboardLayout'



export default function Landing() {
  return (
    <div>
      <HeroSection />
      <Stats />
      <Wealth />
      <Features/>
      <OurSecurity />
      <Testimonials />
      <CallToAction />
      <Footer />

      {/* <Sidebar /> */}
    </div>
  )
}
