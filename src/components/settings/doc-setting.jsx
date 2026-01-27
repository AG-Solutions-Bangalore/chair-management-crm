import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Logo from "../../assets/receipt/fts1.png";
import Action from "/help/action.jpg";
import Add_Group from "/help/add group.png";
import Add_Group2 from "/help/add group-2.png";
import Company_donor from "/help/company donor.png";
import Create_receipt from "/help/create receipt.png";
import Dashboard from "/help/dashboard.png";
import Dashboard2 from "/help/dashboard-2.png";
import Donor_detail from "/help/donor detail.png";
// import Donor_detail2 from "/help/donor detail-2.png";
import Donor_group from "/help/donor group.png";
import Donor from "/help/donor.png";
import Duplicate from "/help/duplicate.png";
import Duplicate2 from "/help/duplicate-2.png";
import Individual_donor from "/help/individual donor.png";
import Login_page from "/help/login-page.png";
import Member from "/help/member.png";
import Reset_page from "/help/reset-page.png";
import Receipt_list from "/help/receipts_list.png";
import Form from "/help/form.png";
import Bill from "/help/bill.png";
import Suspense from "/help/suspense.png";
import Schools_list from "/help/schools list.png";
import School_detail from "/help/school detail.png";
import School_allot from "/help/school allot.png";
import School_donor from "/help/school donor.png";
import School_allotment from "/help/school allotment.png";
import School_donor_detail from "/help/school donor detail.png";
import Allotment_letter from "/help/allotment letter.png";
import Repeat_donor from "/help/repeat donor.png";
import Donor_summary from "/help/donor summary.png";
import Promoter_summary from "/help/promoter summary.png";
import Receipt_summary from "/help/receipt summary.png";
import Donation_summary from "/help/donation summary.png";
import School_summary from "/help/school summary.png";
import Receipt_document from "/help/receipt document.png";
import Suspense_summary from "/help/suspense summary.png";
import Payment_summary from "/help/payment summary.png";
import Download_receipts from "/help/download receipts.png";
import Download_donor from "/help/download donor.png";
import Download_school from "/help/download school.png";
import Download_ots from "/help/download ots.png";
import Download_team from "/help/download team.png";
import Download_all from "/help/download all.png";
import Faq from "/help/faq.png";
import Team from "/help/team.png";
import Notices from "/help/notices.png";
import Basic from "/help/basic.jpg";
import Fundamental from "/help/fundamental.jpg";
import User_profile from "/help/user profile.png";
import Password from "/help/password.png";
import Find_fts from "/help/find fts.png";
import New_user from "/help/new user.png";
import Create_user from "/help/create user.png";
import Any_action from "/help/any action.jpg";
import Clear from "/help/clear.png";
import { useNavigate } from 'react-router-dom';

const DocSetting = () => {
     const handleClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
     
  return (
    <Card>
    <CardHeader>
      <CardTitle>Documentation </CardTitle>
      <CardDescription>Manage your documents</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="bg-white  rounded-lg">
             
               <form id="dowRecp" autoComplete="off ">
                 <div className="row  item-center ">
                   <div className="p-4 bg-white rounded-b-xl">
                     {/* Logo Section */}
                     <div className="flex justify-center mb-4">
                       <img loading="lazy"   src={Logo} alt="FTS Logo" className="w-60 h-auto" />
                     </div>
     
                     {/* Content Section */}
                     <div className="flex flex-col items-center text-center space-y-4">
                       <h1 className="text-sm  font-bold">
                         CHAMP - Chapter Head-office Activities Management Program
                       </h1>
                       <h2 className="text-xl underline text-blue-600">
                         Instruction Manual / Guidebook
                       </h2>
                       <p className="text-justify text-sm text-black px-4 md:px-12">
                         <span className="font-semibold underline">
                           About FTS Champ:
                         </span>
                         <br />
                         Friends of Tribal Society (FTS), also known as Vanbandhu
                         Parishad, is a non-governmental and voluntary organization
                         established in 1989 in Kolkata, India. FTS is committed to
                         uplifting the underprivileged rural and tribal communities
                         across India.
                       </p>
                     </div>
                   </div>
     
                   <hr className="border-b border-gray-700" />
     
                   <div className="haniya">
                     <div className="content-2 p-6 bg-white shadow-lg rounded-lg my-4">
                       <h2 className="underline mb-4 text-xl font-semibold text-center">
                         Contents:
                       </h2>
                       <ul className="space-y-4 pl-4">
                         <li className="font-semibold">User Manual - for CPP</li>
                         <div className="main space-y-4">
                           <li className="flex justify-between">
                             <a
                               href="javascript:void(0);"
                               onClick={() =>
                                 handleClick("Web Application Link and Login Page")
                               }
                               className="text-blue-600 hover:underline"
                             >
                               Web Application Link and Login Page
                             </a>
                             <span>05</span>
                           </li>
                           <li className="flex justify-between">
                             <a
                               href="javascript:void(0);"
                               onClick={() => handleClick("Dashboard")}
                               className="text-blue-600 hover:underline"
                             >
                               Dashboard
                             </a>
                             <span>07</span>
                           </li>
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("Donors")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Donors
                               </a>
                               <span>09</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Full List")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Full List
                                 </a>
                                 <span>09</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Member")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Members
                                 </a>
                                 <span>13</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Duplicate")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Duplicate
                                 </a>
                                 <span>13</span>
                               </li>
                             </ul>
                           </li>
                           <li className="flex justify-between">
                             <a
                               href="javascript:void(0);"
                               onClick={() => handleClick("Manage Donor Group")}
                               className="text-blue-600 hover:underline"
                             >
                               Manage Donor Group
                             </a>
                             <span>16</span>
                           </li>
                           <li className="flex justify-between">
                             <a
                               href="javascript:void(0);"
                               onClick={() => handleClick("Receipt Creation")}
                               className="text-blue-600 hover:underline"
                             >
                               Receipt Creation
                             </a>
                             <span>19</span>
                           </li>
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("Receipts")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Receipts
                               </a>
                               <span>22</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Receipt")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Receipt
                                 </a>
                                 <span>22</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Edit list")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Edit list
                                 </a>
                                 <span>23</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Suspense list")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Suspense list
                                 </a>
                                 <span>24</span>
                               </li>
                             </ul>
                           </li>
                           {/* Repeat similar structure for other nested lists */}
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("School list")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Shool list
                               </a>
                               <span>22</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("School to Allot")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   School to Allot
                                 </a>
                                 <span>26</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Alloted Schools")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Alloted Schools
                                 </a>
                                 <span>27</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Repeat Donors")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Repeat Donors
                                 </a>
                                 <span>28</span>
                               </li>
                             </ul>
                           </li>
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("Reports")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Reports
                               </a>
                               <span>29</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Donor Summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Donor Summary
                                 </a>
                                 <span>29</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Promoter Summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Promoter Summary
                                 </a>
                                 <span>29</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Receipt summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Receipt Summary
                                 </a>
                                 <span>30</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Donation summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Donation Summary
                                 </a>
                                 <span>31</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("School summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   School Summary
                                 </a>
                                 <span>31</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("10BD summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   10BD Summary
                                 </a>
                                 <span>32</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Suspense summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Suspense Summary
                                 </a>
                                 <span>32</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Payment summary")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Payment Summary
                                 </a>
                                 <span>33</span>
                               </li>
                             </ul>
                           </li>
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("Download")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Download
                               </a>
                               <span>34</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Download Receipt")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Download Receipt
                                 </a>
                                 <span>34</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Download Donor")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Download Donor
                                 </a>
                                 <span>34</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Download School")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Download School
                                 </a>
                                 <span>34</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Download OTS")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Download OTS
                                 </a>
                                 <span>35</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Download Team")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Download Team
                                 </a>
                                 <span>35</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() =>
                                     handleClick("Download All Receipt")
                                   }
                                   className="text-blue-600 hover:underline"
                                 >
                                   Download All Receipt
                                 </a>
                                 <span>36</span>
                               </li>
                             </ul>
                           </li>
     
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("Others")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Others
                               </a>
                               <span>37</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("FAQ")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   FAQ
                                 </a>
                                 <span>37</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Team")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Team
                                 </a>
                                 <span>37</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Notices")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Notices
                                 </a>
                                 <span>38</span>
                               </li>
                             </ul>
                           </li>
     
                           <li className="space-y-2">
                             <div className="flex justify-between">
                               <a
                                 href="javascript:void(0);"
                                 onClick={() => handleClick("Basic Fundamentals")}
                                 className="text-blue-600 hover:underline"
                               >
                                 Basic Fundamentals
                               </a>
                               <span>39</span>
                             </div>
                             <ul className="pl-8 space-y-2">
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() => handleClick("Profile Creation")}
                                   className="text-blue-600 hover:underline"
                                 >
                                   Profile Creation
                                 </a>
                                 <span>41</span>
                               </li>
                               <li className="flex justify-between">
                                 <a
                                   href="javascript:void(0);"
                                   onClick={() =>
                                     handleClick("How to find Donor FTS ID")
                                   }
                                   className="text-blue-600 hover:underline"
                                 >
                                   How to find Donor FTS ID
                                 </a>
                                 <span>43</span>
                               </li>
                             </ul>
                           </li>
     
                           <li className="flex justify-between ">
                             <a
                               href="javascript:void(0);"
                               onClick={() => handleClick("Secretary Manual")}
                               className="text-blue-600 hover:underline"
                             >
                               Secretary Manual
                             </a>
                             <span>44</span>
                           </li>
     
                           <li className="flex justify-between ">
                             <a
                               href="javascript:void(0);"
                               onClick={() => handleClick("Viewer Manual")}
                               className="text-blue-600 hover:underline"
                             >
                               Viewer Manual
                             </a>
                             <span>46</span>
                           </li>
                         </div>
                       </ul>
                     </div>
     
                     <div>
                       <h1 className="flex justify-center font-semibold my-4">
                         <u>User Manual - for CPP</u>
                       </h1>
                       <h2 className="flex justify-center font-semibold my-4">
                         <u>Web Application Link and Login Page:</u>
                       </h2>
     
                       <div className="flex justify-center my-4 p-6">
                         <ul className="text-start space-y-4">
                           <li>
                             The FTS Web Application opens to the login page, serving
                             as the initial gateway to access the various features
                             and functionalities it offers.
                           </li>
                           <li>
                             Users initiate their account with the FTS Web
                             Application by landing on the login page via the URL
                             below.
                           </li>
                           <li>
                             URL:{" "}
                             <a
                               href="https://ftschamp.com"
                               className="text-blue-600 underline"
                             >
                               https://ftschamp.com
                             </a>
                           </li>
                           <li>
                             Upon reaching the login page, users should enter their
                             credentials, consisting of a unique username and a
                             confidential password.
                           </li>
                           <img loading="lazy"  
                             src={Login_page}
                             alt="Login Page Screenshot"
                             className="login-img mx-auto"
                           />
                           <li>
                             If the username and password are correct, they gain
                             access to the application.
                           </li>
                           <li>
                             Upon entering correct login credentials, users
                             experience a successful login, granting them access to
                             the Web Application.
                           </li>
                           <li>
                             If the user credentials are incorrect, a popup
                             notification at the top right corner of the screen shows
                             in red colour – “Username or Password incorrect”.
                           </li>
                           <li>
                             If the user clicks on forget password, it redirects to
                             reset password page, where they can reset the password
                             by entering their username and email ID.
                           </li>
                           <img loading="lazy"  
                             src={Reset_page}
                             alt="Reset Page Screenshot"
                             className="reset-img mx-auto"
                           />
                           <li>
                             Once the user enters the username and email ID, they
                             receive an autogenerated password at the valid email
                             address entered. The user can go back to the login page
                             and log in using that password.
                           </li>
                           <li>
                             The user is advised to change the password to a new one
                             once they log in as the emailed password is not so safe
                             and hard to remember.
                           </li>
                         </ul>
                       </div>
                     </div>
     
                     <div className="flex justify-center my-4 p-6">
                       <div
                         className="dashboard text-center space-y-4"
                         id="Dashboard"
                       >
                         <h1 className="text-2xl font-bold">DASHBOARD</h1>
                         <ul className="space-y-4">
                           <li>
                             After a successful login, users are seamlessly directed
                             to the dashboard – a centralized interface designed to
                             provide an overview of key information and
                             functionalities, as shown below.
                           </li>
                           <img loading="lazy"  
                             src={Dashboard}
                             alt="Dashboard Screenshot"
                             className="dash-img mx-auto"
                           />
                           <img loading="lazy"  
                             src={Dashboard2}
                             alt="Dashboard Screenshot 2"
                             className="dash-img mx-auto"
                           />
                           <li>
                             As shown in the above images, the dashboard typically
                             features two main sections: a left navigation panel for
                             easy access to different application sections, and a
                             main area displaying essential data.
                           </li>
                           <li>
                             <b>Navigation Panel:</b> The left navigation panel
                             serves as a quick and intuitive way for users to
                             navigate between different sections of the application.
                             It includes links to areas such as:
                           </li>
     
                           <div id="navigation-panel" className="flex justify-start">
                             <ol className="ulpaddingLeft list-decimal p-12 space-y-2 text-left">
                               <li>Dashboard</li>
                               <li>Donors</li>
                               <li>Receipts</li>
                               <li>Schools</li>
                               <li>Payment</li>
                               <li>Reports</li>
                               <li>Download</li>
                               <li>Others</li>
                             </ol>
                           </div>
                           <li>
                             <b>Main Area:</b> The main area of the dashboard is
                             dedicated to presenting information in a visually
                             accessible manner. This could include number cards,
                             charts, or other visual representations.
                           </li>
                           <li>
                             All the details displayed in the dashboard are
                             pertaining to the ‘Current Year’ mentioned at the bottom
                             of the screen.
                           </li>
                         </ul>
                       </div>
                     </div>
     
                     <div className=" my-4 p-6">
                       <div className="donors text-center space-y-4" id="Donors">
                         <h1 className="text-2xl font-bold">DONORS</h1>
                         <div className="donor-list p-6 " id="Full List">
                           <p className="flex items-start justify-start">
                             The donors tab consists of 3 lists, namely:
                           </p>
                           <ul className="ulpaddingLeft list-disc p-4 space-y-2 text-left">
                             <li>
                               Full List
                               <ul className="ulpaddingLeft list-disc pl-6 space-y-2">
                                 <li>Create Individual Donor</li>
                                 <li>Create Company Donor</li>
                               </ul>
                             </li>
                             <li>Member</li>
                             <li>Duplicate</li>
                           </ul>
                         </div>
                       </div>
                     </div>
     
                     <div className="flex justify-center my-4 p-6">
                       <div className="donor-list-2 text-center space-y-4">
                         <h1 className="text-2xl font-bold">DONORS</h1>
                         <p>The donors tab consists of 3 lists, namely:</p>
                         <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                           <li>
                             <b>Full List:</b> It consists of the list of all the
                             donors, type of the donor, contact of donor, mobile and
                             email of the donor. It also includes actions, which has
                             view, edit, and receipt button where users can view,
                             edit their details or get the receipt of the donation.
                           </li>
                           <img loading="lazy"  
                             src={Donor}
                             alt="donor Screenshot"
                             className="donor-img-1 mx-auto my-4 p-6"
                           />
                           <li>
                             In the Donor List page, the user can also add a new
                             donor to the list using ‘Add Individual’ or ‘Add
                             Company’ buttons on the top right of the screen based on
                             the donor type.
                           </li>
                           <img loading="lazy"  
                             src={Company_donor}
                             alt="company donor Screenshot"
                             className="donor-img-2 mx-auto my-4"
                           />
                           <img loading="lazy"  
                             src={Individual_donor}
                             alt="individual donor Screenshot"
                             className="donor-img-3 mx-auto my-4"
                           />
                           <li>
                             The details include a field – promoter – where the user
                             can select any promoter from the dropdown list. If the
                             desired promoter isn’t found, the user can select
                             ‘other’ for a manual entry.
                           </li>
                           <li>
                             By selecting the view option in the action column, the
                             user can access all details about a donor, view ‘Old
                             Receipts’ for that donor, and see ‘Receipt Details’
                             which includes family group or company receipts.
                           </li>
                           <img loading="lazy"  
                             src={Donor_detail}
                             alt="donor Screenshot"
                             className="donor-img-4 mx-auto my-4"
                           />
                           <li>
                             Scrolling further in the donor details page reveals
                             family and company details of the donors.
                           </li>
                           {/* <img loading="lazy"  
                             src={Donor_detail2}
                             alt="donor Screenshot"
                             className="donor-img-5 mx-auto my-4"
                           /> */}
                           <li id="Member">
                             <b>Members:</b> This list includes donors who have paid
                             for membership during the Receipt Creation process. The
                             user selects the ending year for the membership.
                           </li>
                           <li>
                             For instance, if the membership fees are ₹1000, and a
                             donor pays ₹1000, they are subscribed for 1 year. If
                             they pay ₹2000, it covers 2 years.
                           </li>
                           <img loading="lazy"  
                             src={Member}
                             alt="member Screenshot"
                             className="member-img mx-auto my-4"
                           />
                           <li id="Duplicate">
                             <b>Duplicate:</b> This list shows donors with duplicate
                             entries, based on matching phone numbers or names.
                           </li>
                           <img loading="lazy"  
                             src={Duplicate}
                             alt="duplicate Screenshot"
                             className="duplicate-img mx-auto my-4"
                           />
                           <li>
                             Steps to remove duplicate entries:
                             <ul className="list-disc pl-6 space-y-2">
                               <li>
                                 <b>Step 1:</b> If the receipt count in duplicates is
                                 ‘0’, a delete button appears in the ‘actions’ column
                                 for removal.
                               </li>
                               <li>
                                 <b>Step 2:</b> If receipt count is one or more,
                                 retain the preferred entry and note the FTS ID, then
                                 use the edit button to remove duplicates.
                               </li>
                               <img loading="lazy"  
                                 src={Duplicate2}
                                 alt="duplicate Screenshot"
                                 className="duplicate-img-2 mx-auto my-4"
                               />
                               <li>
                                 <b>Step 3:</b> Confirm the duplicate entry for
                                 merging with the original entry.
                               </li>
                               <li>
                                 <b>Step 4:</b> Save the changes to eliminate the
                                 duplicate, merging all receipts to the retained
                                 donor ID.
                               </li>
                             </ul>
                           </li>
                         </ul>
                       </div>
                     </div>
     
                     <div className="flex justify-center my-4 p-6">
                       <div className="managing text-center space-y-4">
                         <h1 className="text-2xl font-bold">MANAGING DONOR GROUP</h1>
                         <ul className="ulpaddingLeft list-disc text-left space-y-4 p-8">
                           <li>
                             Donor group means when a donor’s family member or
                             company also donates, their donation receipts can be
                             viewed or downloaded at once.
                           </li>
                           <li>
                             After the donor is created, in the donors list, click on
                             the view button to access the donor details. Scroll
                             below to find the family details and company details.
                           </li>
                           <li>
                             Click on ‘Add Family Member’ or ‘Add Company’ to add a
                             new individual or a new company related to the existing
                             donor.
                           </li>
                           <li>
                             On clicking, the same screen as creating an individual
                             or company appears where the details can be filled and
                             submitted to add the family member or the company of the
                             donor. These details will also be visible in the donors
                             list.
                           </li>
                           {/* <img loading="lazy"  
                             src={Donor_detail2}
                             alt="donor Screenshot"
                             className="donor-detail-2 mx-auto my-4"
                           /> */}
                           <li>
                             If there already exists a donor or a company who should
                             be added as a family member or company of another donor,
                             the user should go to the full donors list screen.
                           </li>
                           <li>
                             Click on the ‘Edit’ button in the ‘actions’ column, and
                             the screen as shown below appears.
                           </li>
                           <img loading="lazy"  
                             src={Donor_group}
                             alt="donor Screenshot"
                             className="donor-group mx-auto my-4"
                           />
                           <li>
                             At the bottom right of the screen, click on the ‘Attach
                             to group’ button, and a popup appears to select the
                             donor group for attachment. Click ‘Add’ to assign them
                             to the respective donor group.
                           </li>
                           <img loading="lazy"  
                             src={Add_Group}
                             alt="donor Screenshot"
                             className="add-group mx-auto my-4"
                           />
                           <li>
                             After the donors are grouped, their donation details
                             will appear together in the ‘receipt details’ section as
                             shown below.
                           </li>
                           <img loading="lazy"  
                             src={Add_Group2}
                             alt="donor Screenshot"
                             className="add-group-2 mx-auto my-4"
                           />
                         </ul>
                       </div>
                     </div>
     
                     <div className="flex justify-center my-4 p-6">
                       <div className="receipts text-center space-y-4">
                         <h1 className="text-2xl font-bold">
                           HOW TO CREATE A RECEIPT?
                         </h1>
                         <p>
                           To create a receipt, the user has to adhere to the
                           following steps:
                         </p>
                         <ul className="ulpaddingLeft list-disc text-left space-y-4 p-8">
                           <li>
                             <b>Step 1:</b> Go to the full list section under donors.
                           </li>
                           <li>
                             <b>Step 2:</b> Select or search for a donor for whom the
                             receipt should be created. If the donor is new, the user
                             should first create a donor (refer to the process under
                             Donors page 09-12).
                           </li>
                           <li>
                             <b>Step 3:</b> Click on the ‘Receipt’ button under
                             Actions adjacent to the donor whose receipt needs to be
                             created.
                           </li>
                           <img loading="lazy"  
                             src={Action}
                             alt="action Screenshot"
                             className="action mx-auto my-4"
                           />
                           <li>
                             <b>Step 4:</b> Fill in the required details in the form
                             that appears as shown below.
                           </li>
                           <img loading="lazy"  
                             src={Create_receipt}
                             alt="create receipt Screenshot"
                             className="create-receipt mx-auto my-4"
                           />
                           <li>
                             <b>Step 5:</b> After filling in the relevant details,
                             click on submit. The receipt will be created, and the
                             user will be redirected to the list view of receipts.
                           </li>
                         </ul>
                       </div>
                     </div>
     
                     <div id="details" className="text-center space-y-4 my-6 p-6">
                       <h2 className="text-2xl font-semibold underline">
                         MUST KNOW DETAILS:
                       </h2>
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 p-5">
                         <li>
                           <b>Category – 80G Category:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               The donors contributing under 80G are exempted from
                               tax payment.
                             </li>
                             <li>
                               People in the 80G category are not liable to pay taxes
                               and can donate cash donations only within 2000 INR.
                             </li>
                             <li>
                               80G category donors who donate above 2000 INR can
                               contribute only by cheque or any kind of transfers
                               excluding cash donations.
                             </li>
                             <li>
                               The 80G category is only applicable for General and
                               School Donations.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Category – Non 80G Category:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               The non-80G category does not have any restrictions
                               while contributing.
                             </li>
                             <li>
                               They will only have to pay taxes for the donation they
                               contribute.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Purpose – One Teacher School:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               School donation fixed amount is 22K. A donor cannot
                               donate either more or less to school donation.
                             </li>
                             <li>
                               For instance, if a donor contributes less than ₹22K,
                               say ₹20K, it will be registered under ‘General
                               Donation’.
                             </li>
                             <li>
                               Similarly, if a donor contributes more than ₹22K, for
                               example, ₹45K, the donation amount is split as 22K
                               twice for school donation, with the remaining ₹1K
                               allocated to general donation.
                             </li>
                             <li>
                               The user should select the count of schools to be
                               allotted in its respective field according to the
                               donation amount.
                             </li>
                             <li>
                               The donation year should also be selected in the
                               ‘school allotment year’ field for which year the
                               donation is being made.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Purpose – Membership:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               A donor can be a member of the FTS champ by paying for
                               membership.
                             </li>
                             <li>
                               The member can renew their membership after it ends.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Transaction Details:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               The user can enter the transaction details. These
                               details are printed on the receipt.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Remarks:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               The remarks section is only for internal use and
                               doesn’t appear in any copies of receipts or
                               communications with donors.
                             </li>
                           </ul>
                         </li>
                       </ul>
                     </div>
     
                     <div id="Receipts" className=" section space-y-4 my-6 p-6">
                       <h1 className="text-2xl font-bold flex justify-center">
                         RECEIPTS
                       </h1>
                       <p>
                         The receipts section consists of a full list and suspense of
                         donors.
                       </p>
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 p-8">
                         <li id="Receipts list">
                           <b>Receipts List:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               When the user views the full list table, it includes
                               Receipts number, Name, Date, Exemption type, Donation
                               type, Amount, and Action.
                             </li>
                             <img loading="lazy"  
                               src={Receipt_list}
                               alt="list screenshot"
                               className="receipts-list"
                             />
                             <li>
                               It gives all the details of the receipts that are
                               created under all the donors' names.
                             </li>
                             <li>
                               In the Action column, users can view the receipt where
                               the receipt can be downloaded, sent as an email, and
                               printed.
                             </li>
                             <li>
                               By scrolling on the same page, the user can find the
                               receipt acknowledgment letter, which also can be
                               printed.
                             </li>
                             <li>The reference images are shown below.</li>
                             <img loading="lazy"  
                               src={Form}
                               alt="form screenshot"
                               className="form-img"
                             />
                             <img loading="lazy"  
                               src={Bill}
                               alt="bill screenshot"
                               className="bill-img"
                             />
                           </ul>
                         </li>
                         {/* <li id="Edit list">
                           <b>Edit list:</b>
                           <ul className="list-disc pl-5 space-y-2">
                             <li>
                               Once the user creates the receipt, they cannot edit
                               it. If the receipt needs to be edited, they need to
                               request the secretary for the same.
                             </li>
                           </ul>
                         </li> */}
                         {/* <li id="Suspense list">
                           <b>Suspense List:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The suspense list consists of Receipts number, Name,
                               Date, Exemption type, Amount, and Action. The action
                               contains the edit option.
                             </li>
                             <li>
                               The suspense list is basically the unnamed or unknown
                               entries whose receipts are created on the payment
                               date.
                             </li>
                             <li>
                               Using the edit button, the suspense entry can be
                               edited by the user as and when the donor is
                               identified. The suspense entry eliminates the errors
                               of duplicate entries when the donor claims the
                               donation and requests a receipt.
                             </li>
                             <li>
                               The user is able to generate the receipt for the same
                               date as the donation, avoiding any confusions in
                               donation and receipt dates.
                             </li>
                             <img loading="lazy"  
                               src={Suspense}
                               alt="suspense screenshot"
                               className="suspense-img"
                             />
                           </ul>
                         </li> */}
                       </ul>
                     </div>
     
                     <div className="school space-y-4 my-6 p-6" id="Schools">
                       <h1 className="text-2xl font-bold flex justify-center">
                         Schools
                       </h1>
                       <p>
                         This tab includes the school list, schools to allot, school
                         allotment list, and repeat donors.
                       </p>
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                         <li id="School list">
                           <b>School List:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The school list consists of State, District, Achal,
                               Cluster, Sub-Cluster, Village, School Code, Status,
                               and Action.
                             </li>
                             <img loading="lazy"  
                               src={Schools_list}
                               alt="school screenshot"
                               className="schools-list"
                             />
                             <li>
                               In the Action section, the user can view the school
                               details and the Donor’s FTS ID who has donated for
                               that school.
                             </li>
                             <img loading="lazy"  
                               src={School_detail}
                               alt="school screenshot"
                               className="school-detail"
                             />
                             <li>
                               The status column shows if the school has been
                               allotted to a donor or not.
                             </li>
                           </ul>
                         </li>
                         <li id="School to Allot">
                           <b>School to Allot:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The donors visible in this list are only those who
                               have created the receipt for ‘One Teacher School’.
                               They consist of Donor Name, Type, Mobile, Email,
                               Allotment Year, OTS Received, and Allotment.
                             </li>
                             <li>
                               The Allotment column contains a button, which on
                               clicking will open a list of schools that are allotted
                               and to be allotted. The user can choose the schools to
                               allot to the donor.
                             </li>
                             <img loading="lazy"  
                               src={School_allot}
                               alt="school screenshot"
                               className="school-allot"
                             />
                             <img loading="lazy"  
                               src={School_donor}
                               alt="school screenshot"
                               className="school-donor"
                             />
                           </ul>
                         </li>
                         <li id="Alloted School">
                           <b>Alloted Schools:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This list shows which school is selected for donation.
                               The Schools Allotments List consists of Donor Name,
                               School Allot Year, From Date, To Date, OTS Received,
                               Schools Allotted, Pending, and Action.
                             </li>
                             <img loading="lazy"  
                               src={School_allotment}
                               alt="school screenshot"
                               className="school-allotment"
                             />
                             <li>
                               In the Action section, users can edit by allotting or
                               revoking the allotment of the schools to donors, view
                               the same, and in the receipts button, the user can
                               view, download the PDF, and print the acknowledgment
                               letter along with its receipt.
                             </li>
                             <img loading="lazy"  
                               src={School_donor_detail}
                               alt="school screenshot"
                               className="school-detail"
                             />
                             <img loading="lazy"  
                               src={Allotment_letter}
                               alt="school screenshot"
                               className="allotment-letter"
                             />
                           </ul>
                         </li>
                         <li id="Repeat Donors">
                           <b>Repeat Donors:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The repeated donors who contribute more than once can
                               be viewed and created under 'Repeat Donors'.
                             </li>
                             <img loading="lazy"  
                               src={Repeat_donor}
                               alt="school screenshot"
                               className="repeat-donor"
                             />
                           </ul>
                         </li>
                       </ul>
                     </div>
     
                     <div id="Reports" className="reports space-y-4 my-6 p-6">
                       <h1 className="text-2xl font-bold flex justify-center">
                         Reports
                       </h1>
                       <p>
                         The reports tab basically is used to view reports of all
                         kinds. It includes the following:
                       </p>
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                         <li id="Donor Summary">
                           <b>Donor Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               It consists of the form which needs to be filled with
                               the required donor name and the starting and ending
                               dates between which the report is needed. The user can
                               select the type of view between ‘Individual View’ or
                               ‘Group View’ to look at the kind of report he/she
                               wants.
                             </li>
                             <img loading="lazy"  
                               src={Donor_summary}
                               alt="Donor summary report screenshot"
                               className="donor-summary"
                             />
                           </ul>
                         </li>
                         <li id="Promoter Summary">
                           <b>Promoter Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               It consists of the form which needs to be filled with
                               the required Promoter name and the starting and ending
                               dates between which the report is needed. The user can
                               either only view the report or can even download the
                               reports of the promoters by clicking on the buttons
                               below.
                             </li>
                             <img loading="lazy"  
                               src={Promoter_summary}
                               alt="Promoter summary report screenshot"
                               className="promoter-summary"
                             />
                           </ul>
                         </li>
                         <li id="Receipt Summary">
                           <b>Receipt Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This tab only gives out all the receipts within a
                               selected date period. The user can view and download
                               the report between the selected dates.
                             </li>
                             <img loading="lazy"  
                               src={Receipt_summary}
                               alt="Receipt summary report screenshot"
                               className="receipt-summary"
                             />
                           </ul>
                         </li>
                         <li id="Donation Summary">
                           <b>Donation Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               Similar to Receipt Summary, this tab also creates
                               provision to view and download any report of donations
                               made between two specific dates.
                             </li>
                             <img loading="lazy"  
                               src={Donation_summary}
                               alt="Donation summary report screenshot"
                               className="donation-summary"
                             />
                           </ul>
                         </li>
                         <li id="School Summary">
                           <b>School Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This tab allows users to access the reports of the
                               donors who donated to the schools. By selecting the
                               donor, the user can view and download the number and
                               all the details of the schools he/she has donated to
                               so far.
                             </li>
                             <img loading="lazy"  
                               src={School_summary}
                               alt="School summary report screenshot"
                               className="school-summary"
                             />
                           </ul>
                         </li>
                         <li id="10BD Statement">
                           <b>10BD Statement:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The 10BD form can be viewed using this tab. The user
                               can select the dates in between which he/she wants its
                               report. It has options to download and view where the
                               user can plainly view or download the details, No PAN
                               Download and No PAN View where the user can view or
                               download the details of non-PAN donations, Download
                               Group and View Group where the user can view or
                               download the reports groupwise.
                             </li>
                             <img loading="lazy"  
                               src={Receipt_document}
                               alt="10BD statement report screenshot"
                               className="receipt-document"
                             />
                           </ul>
                         </li>
                         {/* <li id="Suspense Summary">
                           <b>Suspense Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This tab gives out the report of the Chapter, Year,
                               and Number of suspense donations in total.
                             </li>
                             <img loading="lazy"  
                               src={Suspense_summary}
                               alt="Suspense summary report screenshot"
                               className="suspense-summary"
                             />
                           </ul>
                         </li> */}
                         {/* <li id="Payment Summary">
                           <b>Payment Summary:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               Under this tab, users can view and download the
                               reports of all the payments between selected dates as
                               per their requirement.
                             </li>
                             <img loading="lazy"  
                               src={Payment_summary}
                               alt="Payment summary report screenshot"
                               className="payment-summary"
                             />
                           </ul>
                         </li> */}
                       </ul>
                     </div>
     
                     <div id="Download" className="downloads space-y-4 my-6 p-6">
                       <h1 className="text-2xl font-bold flex justify-center">
                         Downloads
                       </h1>
                       <p>
                         This tab allows the user to download the specific data of
                         the following:
                       </p>
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                         <li id="Download Receipt">
                           <b>Download Receipts:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user can download the receipts between the
                               selected dates, along with the required purpose,
                               category, and source of the receipt.
                             </li>
                             <img loading="lazy"  
                               src={Download_receipts}
                               alt="Download receipts screenshot"
                               className="download-receipts"
                             />
                           </ul>
                         </li>
                         <li id="Download Donor">
                           <b>Download Donor:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user can download the records of the Donors by
                               selecting the type of donors in the dropdown list
                               provided.
                             </li>
                             <img loading="lazy"  
                               src={Download_donor}
                               alt="Download donor screenshot"
                               className="download-donor"
                             />
                           </ul>
                         </li>
                         <li id="Download School">
                           <b>Download School:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user can download the records of either the
                               allotted schools or the unallotted schools within the
                               starting and ending dates.
                             </li>
                             <img loading="lazy"  
                               src={Download_school}
                               alt="Download school screenshot"
                               className="download-school"
                             />
                           </ul>
                         </li>
                         <li id="Download OTS">
                           <b>Download OTS:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user can download the records of the ‘One Teacher
                               Schools’ between the selected range of dates.
                             </li>
                             <img loading="lazy"  
                               src={Download_ots}
                               alt="Download OTS screenshot"
                               className="download-ots"
                             />
                           </ul>
                         </li>
                         <li id="Download Team">
                           <b>Download Team:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user can download the records of Teams between the
                               selected dates.
                             </li>
                             <img loading="lazy"  
                               src={Download_team}
                               alt="Download team screenshot"
                               className="download-team"
                             />
                           </ul>
                         </li>
                         <li id="Download All Receipt">
                           <b>Download All Receipts:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user is able to download the records of all the
                               receipts between a selected range of dates, while also
                               choosing the other options of purpose, category, donor
                               type, promoter, the OTS range, amount range, and the
                               source of the donations.
                             </li>
                             <img loading="lazy"  
                               src={Download_all}
                               alt="Download all receipts screenshot"
                               className="download-all"
                             />
                           </ul>
                         </li>
                       </ul>
                     </div>
     
                     <div id="Others" className="others space-y-4 my-6 p-6">
                       <h1 className="text-2xl font-bold flex justify-center">
                         Others
                       </h1>
                       <p>The others tab includes FAQs, Team, and Notices.</p>
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                         <li id="FAQ">
                           <b>FAQ:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This tab contains the frequently asked questions and
                               their answers.
                             </li>
                             <img loading="lazy"   src={Faq} alt="FAQ screenshot" className="faq" />
                           </ul>
                         </li>
                         <li id="Team">
                           <b>Team:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This is to create a committee member who becomes one
                               of the team. The committee list is right under the
                               creation form.
                             </li>
                             <img loading="lazy"  
                               src={Team}
                               alt="Team screenshot"
                               className="team"
                             />
                           </ul>
                         </li>
                         <li id="Notices">
                           <b>Notices:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               Any notifications posted by the head office to its
                               users can be viewed in this tab. The user should
                               acknowledge these notices mandatorily.
                             </li>
                             <img loading="lazy"  
                               src={Notices}
                               alt="Notices screenshot"
                               className="notices"
                             />
                           </ul>
                         </li>
                       </ul>
                     </div>
     
                     <div
                       id="Basic Fundamentals"
                       className="basic-fundamentals space-y-4 my-6 p-6"
                     >
                       <h1 className="text-2xl font-bold flex justify-center">
                         Basic Fundamentals
                       </h1>
                       <p>
                         In any list view, there are a few basic buttons that
                         seamlessly facilitate easy access or quick options for the
                         user.
                       </p>
                       <img loading="lazy"  
                         src={Basic}
                         alt="Basic fundamentals screenshot"
                         className="basic-img"
                       />
                       <ul className="ulpaddingLeft list-disc text-left space-y-4 pl-5">
                         <li>
                           <b>Search Button:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               It helps to search anything and reflects the matching
                               results.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Download Button:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               On clicking the download button, the user is able to
                               download the list details of the respective list in an
                               Excel (.csv) format.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Print Button:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               This enables the user to easily print the visible
                               details of the respective list one by one.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>View Columns Button:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               It offers the user to hide or unhide the visibility of
                               the columns of the list view.
                             </li>
                           </ul>
                         </li>
                         <li>
                           <b>Filters Button:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               The user can use this button to filter and view the
                               required list of donors by any field.
                             </li>
                             <li>
                               In any screen throughout the application, there are 2
                               buttons to the left and right corners.
                             </li>
                             <li>
                               The left button is used to hide or unhide the
                               navigation panel.
                             </li>
                             <li>
                               The right button is used to view the application in
                               full screen.
                             </li>
                             <img loading="lazy"  
                               src={Fundamental}
                               alt="Basic fundamentals screenshot"
                               className="fundamental"
                             />
                           </ul>
                         </li>
                         <li id="Profile Creation">
                           <b>Profile Creation:</b>
                           <ul className="list-disc pl-5 space-y-4">
                             <li>
                               At the top of the navigation panel, the user can
                               access their profile, where they can view and edit
                               their name and contact number and click on ‘Update
                               Profile’ to save the changes. However, the email ID
                               cannot be edited.
                             </li>
                             <img loading="lazy"  
                               src={User_profile}
                               alt="User profile screenshot"
                               className="user-profile"
                             />
                             <li>
                               Beside ‘My Profile’, there is another tab ‘Change
                               Password’. If the user needs to change their password,
                               they should enter their old password, their new
                               password, and retype the new password to confirm and
                               click on the update profile button to save the
                               changes.
                             </li>
                             <img loading="lazy"  
                               src={Password}
                               alt="Password screenshot"
                               className="password"
                             />
                             <li>
                               In every page of the application, the latest updated
                               date is visible at the bottom of the navigation panel.
                             </li>
                           </ul>
                         </li>
                       </ul>
                     </div>
     
                     <div
                       id="How to find Donor FTS ID"
                       className="fts my-6 flex justify-center"
                     >
                       <div className="text-center space-y-4">
                         <h1 className="text-2xl font-bold">
                           How to Find Donor FTS ID
                         </h1>
                         <img loading="lazy"  
                           src={Find_fts}
                           alt="FTS ID illustration"
                           className="fts-img mx-auto my-4"
                         />
                       </div>
                     </div>
     
                     <div
                       id="Secretary Manual"
                       className="secretary my-6 flex justify-center p-6"
                     >
                       <div className="text-center space-y-4">
                         <h1 className="text-2xl font-bold underline">
                           Secretary Manual
                         </h1>
                         <p>
                           The secretary will have their own username and a
                           confidential password to login to the application.
                         </p>
                         <p>The secretary is authorized for the following:</p>
                         <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                           <li>
                             To create new users, view and edit existing user
                             details.
                             <img loading="lazy"  
                               src={New_user}
                               alt="New user creation"
                               className="new-user mx-auto my-4"
                             />
                             <img loading="lazy"  
                               src={Create_user}
                               alt="Create new user"
                               className="create-user mx-auto my-4"
                             />
                           </li>
                           <li>To update the chapter details.</li>
                           <li>
                             To change the signing authority of the chapter if and
                             when needed (this feature is available under updating
                             the chapter details. Refer to the above images for the
                             same).
                           </li>
                           <li>
                             To edit the details in the receipts of donors. The
                             secretary must mandatorily mention the reason for
                             editing the details.
                             <img loading="lazy"  
                               src={Any_action}
                               alt="Edit action"
                               className="action-img mx-auto my-4"
                             />
                           </li>
                         </ul>
                       </div>
                     </div>
     
                     <div
                       id="Viewer Manual"
                       className="viewer my-6 flex justify-center p-6"
                     >
                       <div className="text-center space-y-4">
                         <h1 className="text-2xl font-bold">Viewer Manual</h1>
                         <ul className="ulpaddingLeft list-disc text-left space-y-4 p-6">
                           <li>
                             The viewer is only authorized to view all details
                             related to chapter activities.
                           </li>
                           <li>
                             The only actions operational by the viewer are outlined
                             under Basic Fundamentals on page 39.
                           </li>
                           <li>
                             An additional feature for the viewer is that beside the
                             ‘full screen’ button, there is a button that allows the
                             viewer to select the ‘Chapter’ where they can view
                             records specific to that chapter.
                           </li>
                           <li>
                             There is also a ‘Clear’ button next to it, which allows
                             the viewer to clear the selected chapter.
                             <img loading="lazy"  
                               src={Clear}
                               alt="Clear button screenshot"
                               className="clear-img mx-auto my-4"
                             />
                           </li>
                         </ul>
                       </div>
                     </div>
                   </div>
                 </div>
               </form>
             </div>
    </CardContent>
  </Card>
  )
}

export default DocSetting