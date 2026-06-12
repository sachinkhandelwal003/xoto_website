import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// PAGES
import Dashboard from "./pages/Dashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Freelancerdashboard from "./pages/Freelancerdashboard";
import CustomerList from "./pages/dashboardPages/Customerlist";
import Modules from "./pages/modules/Modules";
import Permission from "./pages/permission/Permission";
import Role from "./pages/role/Role";
import VendorB2C from "./pages/dashboardPages/managevendor/VendorB2C";
import VendorB2CProfile from "./pages/dashboardPages/managevendor/VendorB2CProfile";
import VendorInventory from "../ecommerce/B2C/products/Vendorinventory";
import ProductRequestB2C from "./pages/dashboardPages/manageProducts/ProductRequestB2C";
import CategoryFreelancers from "./pages/dashboardPages/managefreelancer/freelancer/categoryandsubcategory/CategoryFreelancers";
import Freelancers from "./pages/dashboardPages/managefreelancer/freelancer/Freelancers";
import FreelancerProfile from "./pages/dashboardPages/managefreelancer/freelancer/FreelancerProfile";
import MyprofileFreelancer from "./pages/dashboardPages/managefreelancer/freelancer/MyprofileFreelancer";
import UpdateFreelncerProfile from "./pages/dashboardPages/managefreelancer/freelancer/UpdateFreelancerProfile";
import Projects from "./pages/dashboardPages/managefreelancer/freelancer/Projects/Projects";
import ViewwProject from "./pages/dashboardPages/ViewLibrary";
import MyProjects from "./pages/dashboardPages/managefreelancer/freelancer/Projects/MyProjects";
import Accountant from "./pages/dashboardPages/manageaccountant/Accountant";
import AccountantDashboard from "./pages/AccountantDashboard";
import ManageProjects from "./pages/dashboardPages/manageaccountant/ManageProjects";
import AddProjects from "./pages/dashboardPages/managefreelancer/freelancer/Projects/AddProjects";
import AddCategory from "../ecommerce/B2C/products/AddCategory";
import AddMaterial from "../ecommerce/B2C/products/AddMaterial";
import AddBrand from "../ecommerce/B2C/products/AddBrand";
import AllVendorProductB2C from "./pages/dashboardPages/manageProducts/AllVendorProductB2C";
import VendorProducts from "../ecommerce/B2C/products/VendorProducts";
import AddProducts from "../ecommerce/B2C/products/AddProducts";
import Currency from "./pages/settings/Currency";
import Tax from "./pages/settings/Tax";
import ProductReview from "./pages/dashboardPages/manageProducts/ProductReview";
import ProductProfile from "../ecommerce/B2C/products/ProductProfile";
import VendorProfile from "./pages/dashboardPages/managevendor/VendorProfile";
import UsersRoleList from "./pages/dashboardPages/users/UsersRoleList";
import LeadsList from "./pages/dashboardPages/leads/LeadsList";

import SupervisorDashboard from "./pages/SupervisorDashboard";
import AssignedLeadsList from "./pages/dashboardPages/leads/AssignedLeadsList";
import QuatationLeadsList from "./pages/dashboardPages/leads/QuatationLeadsList";
import Myestimates from "./pages/dashboardPages/leads/Myestimates";
import Leads from "./pages/dashboardPages/leads/Leads";
import Customerdashboard from "./pages/Customerdashboard";
import MyProfileB2C from "./pages/dashboardPages/managevendor/vendorprofile/Vendorb2c-Myprofile";
import MyProfileb2b from "./pages/dashboardPages/managevendor/vendorprofile/Vendorb2b-MyProfile";
import MyProfile from "./pages/dashboardPages/Profiles/FreelancerProfile";
import UpdateFreelancerProfile from "./pages/dashboardPages/managefreelancer/freelancer/UpdateFreelancerProfile";
import Bookings from "./pages/dashboardPages/consult/Bookings";
import Packages from "./pages/packages/Packages";
import MasterCategory from "./pages/estimateMaster/MasterCategory";
import Enquiry from "./pages/dashboardPages/consult/Enquiry";
import PropertyLeads from "./pages/dashboardPages/consult/PropertyLeads";
import Meta from "./pages/dashboardPages/consult/MetaLeads";
import MyListings from "./pages/MyListings";
import UpdateProfilePage from "./pages/dashboardPages/updates/UpdateProfilepage";
import Inventory from "../ecommerce/B2C/products/Inventory";
import AddAttributes from "../ecommerce/B2C/products/AddAttributes";
import AddTags from "../ecommerce/B2C/products/AddTags";
import UpdateProduct from "../ecommerce/B2C/products/UpdateProduct";
import ViewProject from "./pages/dashboardPages/managefreelancer/freelancer/Projects/ViewProjects";
import TypesGallery from "./pages/estimateMaster/TypesGallery";
import Questions from "./pages/estimateMaster/Questions";
import CreateDeveloper from "./pages/Properties/createDeveloper";
import Propertymanagement from "./pages/Properties/Propertymanagement";
import ApprovalQueue from "./pages/Properties/ApprovalQueue";
import EditReviewQueue from "./pages/Properties/EditReviewQueue";
import Blog from "./pages/Blog/CreateBlog";
import SubmittedQuotation from "./pages/dashboardPages/leads/quotation/SubmittedQuotation";
import ApprovedQuotation from "./pages/dashboardPages/leads/quotation/ApprovedQuotation";
import ReceivedQuotation from "./pages/dashboardPages/leads/quotation/Customer/ReceivedQuotation";
import CustomerSubmittedQuotation from "./pages/dashboardPages/leads/quotation/Customer/CustomerSubmittedQuotation";
import EmailSetting from "./pages/settings/EmailSetting";
import Notifications from "./pages/dashboardPages/notification/Notifications";
import ManageProjectsSupervisor from "./pages/dashboardPages/managefreelancer/freelancer/Projects/ManageProjectsSupervisor";
import ManageProjectFreelancer from "./pages/dashboardPages/managefreelancer/freelancer/Projects/ManageProjectFreelancer";
import CustomerProjects from "./pages/dashboardPages/managefreelancer/freelancer/Projects/CustomerProjects";
import CustomerBillsview from "./pages/dashboardPages/Bills/CustomerBillsview";
import CustomerInvoicesview from "./pages/dashboardPages/Bills/CustomerInvoicesview";
import Profile from "./pages/dashboardPages/Profiles/Profile";
import AgentList from "./pages/Properties/AgentList";
import AgencyList from "./pages/Properties/AgencyList";
import DeveloperList from "./pages/DeveloperList";
import DeveloperDetail from "./pages/Developerdetail";
import DealCommissionManager from "./pages/DealCommissionManager";
import SuperAdminHome from "./pages/SuperAdmin/SuperAdminHome";
import NewsletterSubscribers from "./pages/dashboardPages/newsletter/NewsletterSubscribers";
import BankList from "./pages/bank/BankList";
import BankDetail from "./pages/bank/BankDetail";
import BankManagement from "./pages/bank/BankManagement";
import BankProducts from "./pages/bank/BankProducts";
import BankProductManagement from "./pages/bank/BankProductManagement";
import Eibor from "./pages/bank/Eibor";

// import AgencyAssignProjects from "../ecommerce/B2C/AgencyAssignProjects";

// import RegistrationAgency from "./pages/Properties/RegistrationAgency";
// import AddBrand from "../ecommerce/B2C/products/AddBrand"
import AdminDashboard from "./pages/AdminDashboard";
import AdminPropertyGrid from "./pages/AdminPropertyGrid";
import AdminPropertyListings from "./pages/Adminpropertylistings"
import AdminPropertyDetail from "./pages/Adminpropertydetails";
import AdminOffPlanCreate from "./pages/Adminoffplancreate";
import LeadManagement from "./pages/LeadManagement";
import AgencyLeadDetailsPage from "./pages/AgencyLeadDetailsPage";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import VerificationQueue from "./pages/VerificationQueue";
import XobiaTrainingAdmin from "./pages/XobiaTrainingAdmin";
import GlobalSettings from "./pages/GlobalSettings";
import XotoBlitzCampaigns from "./pages/XotoBlitzCampaigns";
import MyChatRequests from "../chat/Mychatrequests";
import AdminChatRequests from "../chat/Adminchatrequests";
import WaitingApproval from "../ecommerce/B2C/WaitingApproval";
import AgentDetail from "./pages/Properties/Agentdetail";
import DeveloperForm from "./pages/dashboardPages/DeveloperForm";
import OnBoardingAgent from "./pages/dashboardPages/OnBoardingAgent";
import OnBoardingAgency from "./pages/dashboardPages/OnBoardingAgency";
import CreateSecondaryProperty from "./pages/Properties/CreateSecondaryProperty";
import SecondaryPlans from "./pages/Properties/SecondaryPlans";
import SecondaryPropertyDetail from "./pages/Properties/Secondarypropertydetail";


// import GridCreateadvisor from "../Grid/GridAdmin.jsx/GridCreateadvisor";
// import AllAdvisors from "../Grid/GridAdmin.jsx/Alladvisors";
// import AdvisorDetail from "../Grid/GridAdmin.jsx/Advisordetail";
// import AllReferralPartners from "../GridReferralPartner/Admin/AllReferralPartners";
// import ReferralPartnerDetail from "../GridReferralPartner/Admin/ReferralPartnerDetail";
// import PlatformLeads from "../Grid/GridAdmin.jsx/PlatformLeads";
// import AdvisorLeadsPage from "../Grid/AdvisorGrid/Advisorleadspage";
// import PropertyCatalogue from "../Grid/AdvisorGrid/Propertycatalogue";
// import FavouriteProperty from "../Grid/Fav Property/FavouriteProperty";
// import AgentLeads from "../Grid/GridAdmin.jsx/AgentLeads";
// import AddGeneralleads from "../Grid/GridAdmin.jsx/AddGeneralleads";
// import GeneralLeads from "../Grid/GridAdmin.jsx/GeneralLeads";
// import ReferralLeads from "../Grid/GridAdmin.jsx/ReferralLeads";
// import AllgridLeads from "../Grid/GridAdmin.jsx/AllgridLeads";
// import CreateOffplan from "../Grid/GridAdmin.jsx/CreateOffplan";
// import CommissionDashboard from "../Grid/GridAdmin.jsx/CommissionDashboard";
// import GridAgentLead from "../Grid/GridAgent/GridAgentLead";
// import CreateAgentLead from "../Grid/GridAgent/CreateAgentLead";


import PartnerList from "../ecommerce/B2C/PartnerList";
import PartnerLeadDetails from "../ecommerce/B2C/PartnerLeadDetails";
import ProposalForm from "../ecommerce/B2C/ProposalForm";
import MortgageOpsDashboard from "../ecommerce/B2C/MortgageopsDashboard";
import PropertyDetailPage from "./pages/Propertydetailpage";
import OnboardPartner from "./pages/OnboardPartner";
import AgentVaultListing from "./pages/AgentVaultListing";
import ReferralProfile from "./pages/dashboardPages/Profiles/ReferraProfile";
import CreateRentalProperty from "../../component/Rent/Createrentalproperty";
import RentalPropertyList from "../../component/Rent/Rentalpropertylist";
import AdminLeadList from "../../component/Rent/Adminleadlist";
import Adminfeedbacks from "../../components/footer/Adminfeedbacks";
import BankProductViewwithdocuments from "./pages/bank/BankProductViewwithdocuments";
import BankProductDocuments from "./pages/bank/BankProductDocuments";
// import GridAgentLeadDetail from "../Grid/GridAgent/GridAgentLeadDetail";
// import GridAgentLeadDetailadmin from "../Grid/GridAdmin.jsx/GridAgentLeadDetailadmin";
// import GridAdvisorLeadDetail from "../Grid/AdvisorGrid/GridAdvisorLeadDetail";
import PerfectMortgageCalculator from "../../components/homepage/MortgageCalculator";
import MortgageEligibilityCalculatorPage from "../../components/homepage/MortgageEligibilityCalculatorPage";
import MortgageAffordabilityCalculatorPage from "../../components/homepage/MortgageAffordabilityCalculatorPage";
import FavouriteProperties from "../Grid/Fav Property/FavouriteProperty";
// import PresentationsList from '../Grid/presentation/PresentationsList';
// import Dealrecordspage from "../Grid/GridAdmin.jsx/Dealrecordspage";
// import DealRecordDetailPage from "../Grid/GridAdmin.jsx/DealRecordDetailPage";
// import AgencyDealsPage from "../Grid/grid agency/Agencydealspage";
// import AdminAgreements from "../Grid/GridAdmin.jsx/Agreement";
// import Agreementdeveloper from "../Grid/DeveloperGrid/Agreementdeveloper";
// import Agreementagency from "../Grid/grid agency/Agreementagency";
// import Agreementagent from "../Grid/GridAgent/Agreementagent";



const roleSlugMap = {
  0: "superadmin",
  1: "admin",
  2: "customer",
  5: "vendor-b2c",
  6: "vendor-b2b",
  7: "freelancer",
  11: "accountant",
  12: "supervisor",
  15: "agency",
  16: "agent",
  17: "developer",
  18: "vault-admin",
  22: "vaultagent",
  26: "vault-advisor",
  23: "vault-ops",
  25: "gridreferralpartner",

  21: "vaultpartner",
  24: "GridAdvisor"
};

const dashboardMap = {
  0:  <Dashboard />,
  2:  <Customerdashboard />,
  5:  <VendorDashboard />,
  7:  <Freelancerdashboard />,
  11: <AccountantDashboard />,
  12: <SupervisorDashboard />,
};

const componentMap = {
  "products/list": <ProductRequestB2C />,
  "modules/list": <Modules />,
  permission: <Permission />,
  roles: <Role />,
  "seller/list": <VendorB2C />,
  "freelancer/category": <CategoryFreelancers />,
  "freelancer/list": <Freelancers />,
  "request/projects": <ManageProjects />,
  "sellers/list": <VendorB2C />,
  projects: <Projects />,
  myProjects: <MyProjects />,
  accountant: <Accountant />,
  users: <UsersRoleList />,

  addProjects: <AddProjects />,
  categories: <AddCategory />,
  material: <AddMaterial />,
  currency: <Currency />,
  tax: <Tax />,
  brands: <AddBrand />,
  "products/my": <VendorProducts />,
  "products/add": <AddProducts />,
  "leads/requested": <LeadsList />,
  "leads/assigned": <AssignedLeadsList />,
  "request/quatation": <QuatationLeadsList />,
  "estimates/my": <Myestimates />,
  "estimate/master/categories": <MasterCategory />,
  "master/types/gallery": <TypesGallery />,
  "estimate/questions": <Questions />,
  deals: <Leads />,
  bookings: <Bookings />,
  "property/leads": <PropertyLeads />,
  "meta/leads": <Meta />,
  enquiries: <Enquiry />,
  packages: <Packages />,
  "developer/create": <CreateDeveloper />,
  "developer/property": <Propertymanagement />
  , "create": <Blog />,
  "products/brands": <AddBrand />,
  "create-mortgages": <BankProductManagement />,
  newsletter: <NewsletterSubscribers />
};


// Placeholder for missing components
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full p-10 text-center text-gray-400">
    <div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p>No component is assigned for this module yet.</p>
    </div>
  </div>
);

const CmsRoutes = () => {
  const { user, permissions } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user?.role?.code) {
    return <div className="p-8 text-center">Loading user...</div>;
  }

  const roleSlug = roleSlugMap[user.role.code] ?? "dashboard";
  const base = `/dashboard/${roleSlug}`; // REMOVED /sawtar


  // Redirect root dashboard to role-specific
  if (
    // location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/"
  ) {
    return <Navigate to={base} replace />;
  }

  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={dashboardMap[user.role.code] ?? <Dashboard />} />

      {/* Static routes for Referral Partner (role 25) */}
      {/* {user.role.code === 25 && (
        <>
          <Route path="submit-leads" element={<ActiveLeads />} />
          <Route path="total-leads" element={<TotalLeads />} />
          <Route path="recent-leads" element={<RecentLeads />} />
          <Route path="profile" element={<ReferralPartnerProfile />} />
          <Route path="leaderboard" element={<ReferralPartnerLeaderboard />} />
          <Route path="lead/:id" element={<ReferralPartnerLeadDetail />} />
        </>
      )} */}

      {/* Dynamic Routes from Permissions */}
      {Object.entries(permissions ?? {}).map(([key, p]) => {
        if (!p?.canView || !p?.route) return null;

        const clean = p.route.replace(/^\/+/, "");
        const Component = componentMap[clean];

        const [moduleName] = key.split("→").map((s) => s.trim());

        return (
          <Route
            key={clean}
            path={clean}
            element={Component ?? <Placeholder title={moduleName} />}
          />
        );
      })}

      {/* SuperAdmin module hub */}
      <Route path="home" element={<SuperAdminHome />} />

      {/* Static Routes */}
      <Route
        path="seller/:id/product-request"
        element={
          permissions?.["Vendor B2C→All Vendors"]?.canView ? (
            <ProductRequestB2C />
          ) : (
            <Navigate to="/seller/list" replace />
          )
        }
      />
      <Route path="quotation/submitted" element={<SubmittedQuotation />} />
      <Route path="quotation/approved" element={<ApprovedQuotation />} />
      <Route path="projects/manage" element={<ManageProjectsSupervisor />} />
      <Route path="projects/manage/:projectId" element={<ManageProjectFreelancer />} />
      <Route path="projects/ongoing" element={<CustomerProjects />} />
      <Route path="ViewLibrary" element={<ViewwProject />} />
      <Route path="myprofile" element={<Profile />} />
      <Route path="products" element={<ProductReview />} />
      <Route path="attributes/add" element={<AddAttributes />} />
      <Route path="tags/add" element={<AddTags />} />
      {/* <Route path="/create" element={<Blog />} /> */}
      <Route path="products/view" element={<ProductProfile />} />
      <Route path="products/edit/:id" element={<UpdateProduct />} />
      {/* <Route path="products/edit/:id" element={<UpdateProduct />} /> */}
      <Route path="/My-favourite-Properties" element={<FavouriteProperties />} />

      <Route path="product/inventory/:id" element={<Inventory />} />

      <Route path="seller/:id" element={<VendorB2CProfile />} />
      <Route path="inventory" element={<VendorInventory />} />

      <Route path="feedbacks" element={<Adminfeedbacks />} />

      {/* <Route path="projects/:id" element={<ViewProject/>} /> */}
      <Route path="quotation/received" element={<ReceivedQuotation />} />
      <Route path="estimate/submitted" element={<CustomerSubmittedQuotation />} />
      <Route path="quotation/response" element={<Myestimates />} />
      <Route path="setting/email" element={<EmailSetting />} />
      <Route path="projects/milestone/bills" element={<CustomerBillsview />} />
      <Route path="projects/invoices" element={<CustomerInvoicesview />} />

      <Route path="seller/product/:id" element={<ProductRequestB2C />} />
      <Route path="freelancer/view" element={<FreelancerProfile />} />
      <Route path="notifications/view" element={<Notifications />} />
      <Route path="freelancer/myprofile" element={<MyprofileFreelancer />} />
      <Route path="/update" element={<UpdateProfilePage />} />


      {/* admin */}
      <Route path="users" element={<UsersRoleList />} />
      <Route path="newsletter" element={<NewsletterSubscribers />} />
      <Route path="deals" element={<Leads />} />
      <Route path="roles" element={<Role />} />
      <Route path="permission" element={<Permission />} />
      <Route path="modules/list" element={<Modules />} />
      <Route path="/agent-list" element={<AgentList />} />
      <Route path="/agency-list" element={<AgencyList />} />
      <Route path="customers/list" element={<CustomerList />} />
      {/* <Route path="/agent-registration" element={<AgentRegistration />} /> */}
      <Route path="/developer-list" element={<DeveloperList />} />
      <Route path="/onboarding/developer" element={<DeveloperForm />} />
      <Route path="/onboarding/agent" element={<OnBoardingAgent />} />
      <Route path="/onboarding/agency" element={<OnBoardingAgency />} />

      <Route path="/property-list" element={<AdminPropertyGrid />} />
      <Route path="/DealCommissionManager" element={<DealCommissionManager />} />
      <Route path="lead-management" element={<LeadManagement />} />
      <Route path="lead-management/:id" element={<AgencyLeadDetailsPage />} />
      <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      <Route path="/verification-queue" element={<VerificationQueue />} />
      <Route path="/ai-training" element={<XobiaTrainingAdmin />} />
      <Route path="/global-settings" element={<GlobalSettings />} />
      <Route path="/marketing-hub" element={<XotoBlitzCampaigns />} />
      <Route path="/admin-chat-requests" element={<AdminChatRequests />} />
      <Route path="/my-listings" element={<MyListings />} />
      <Route path="/properties" element={<AdminPropertyListings />} />
      <Route path="/properties/:id" element={<AdminPropertyDetail />} />
      <Route path="/properties/create-offplan" element={<AdminOffPlanCreate />} />
      <Route path="developer/property/:id" element={<PropertyDetailPage />} />

      {/* <Route path="/GridAdmin/propertyleads" element={<PlatformLeads />} />
      <Route path="/grid/agentleads" element={<AgentLeads />} /> 
      <Route path="/grid/referralleads" element={<ReferralLeads/>}/>
      <Route path="/grid/generalleads" element={<GeneralLeads/>}/>
      <Route path= "/grid/AllgridLeads" element={<AllgridLeads/>}/>
      <Route path="/grid/addgenerallead" element={<AddGeneralleads/>}/>
      <Route path="/grid/createoffplan" element={<CreateOffplan/>}/>
      <Route path="/grid/commission" element={<CommissionDashboard/>}/>
      <Route path="/lead-detail/:id" element={<GridAgentLeadDetail />} />
      <Route path="/lead-detail-admin/:id" element={<GridAgentLeadDetailadmin />} />
     <Route path="gridAdvisorLeads/:id" element={<GridAdvisorLeadDetail />} /> */}
     <Route path="calculator" element={<PerfectMortgageCalculator initialTab="affordability" />} />
     <Route path="mortgages/calculator" element={<PerfectMortgageCalculator initialTab="affordability" />} />
     <Route path="mortgages/calculator/eligibility" element={<MortgageEligibilityCalculatorPage />} />
     <Route path="mortgages/calculator/affordability" element={<MortgageAffordabilityCalculatorPage />} />
     <Route path="mortgages/calculator/emi" element={<PerfectMortgageCalculator initialTab="mortgage" />} />
     <Route path="/property-management" element={<Propertymanagement />} />
     <Route path="listings/approval-queue"    element={<ApprovalQueue />} />
    <Route path="listings/edit-review-queue" element={<EditReviewQueue />} />
    {/* <Route path="deal-records" element={<Dealrecordspage />} />
    <Route path="deal-records/create/:leadId" element={<Dealrecordspage />} />
    <Route path="deal-records/:dealId" element={<DealRecordDetailPage />} /> 
    <Route path="partner/deals" element={<AgencyDealsPage />} />
    <Route path="admin/agreements" element={<AdminAgreements />} />
    <Route path="agency-agreements" element={<Agreementagency />} /> */}
      
      






      {/* Bank & Product Library */}
      <Route path="bank/list" element={<BankList />} />
      <Route path="bank/view/:bankId" element={<BankDetail />} />
      <Route path="bank/manage" element={<BankManagement />} />
      <Route path="bank/manage/:bankId" element={<BankManagement />} />
      <Route path="bank/products" element={<BankProducts />} />
      <Route path="bank/products/manage" element={<BankProductManagement />} />
      <Route path="bank/products/manage/:productId" element={<BankProductManagement />} />
      <Route path="bank/products/view/:productId" element={<BankProductViewwithdocuments />} />
      <Route path="bank/products/documents/:productId" element={<BankProductDocuments />} />
      <Route path="eibor" element={<Eibor />} />

      <Route path="rental/properties" element={<CreateRentalProperty />} />
      <Route path="rental/properties/create" element={<CreateRentalProperty />} />
      <Route path="rental/properties/edit/:id" element={<CreateRentalProperty />} />
      <Route path="rental/propertieslist" element={<RentalPropertyList />} />
      <Route path="rental/leadlist" element={<AdminLeadList />} />


    </Routes>
  );
};

export default CmsRoutes;

