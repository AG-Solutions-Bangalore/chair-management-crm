import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BASE_URL from '@/config/base-url';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Activity,
  Award,
  BadgeCheck,
  BarChart3,
  Building2,
  Calendar,
  CalendarDays,
  CreditCard,
  Crown,
  Gift,
  Globe,
  HeartHandshake,
  IdCard,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
  Users,
  XCircle
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

const fetchDonorById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/api/donor-view/${id}`, getAuthHeaders());
  return data;
};

const fetchOldReceipts = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/api/fetch-receipts-by-old-id/${id}`, getAuthHeaders());
  return data;
};

const fetchDonorReceipts = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/api/donor-all-receipts/${id}`, getAuthHeaders());
  return data;
};

const DonorView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: donorData, isLoading: donorLoading, error: donorError } = useQuery({
    queryKey: ['donor-view', id],
    queryFn: () => fetchDonorById(id),
  });


  const { data: donorReceiptsData, isLoading: donorReceiptsLoading } = useQuery({
    queryKey: ['donorReceipts', id],
    queryFn: () => fetchDonorReceipts(id),
  });

  const statistics = useMemo(() => {
    if (!donorData  || !donorReceiptsData) return null;

   
    const donorReceipts = donorReceiptsData?.donor_receipts || [];
    const membershipDetails = donorReceiptsData?.membership_details || [];
    const familyDetails = donorData?.family_details || [];
    const companyDetails = donorData?.company_details || [];
    const toNumber = (val) => Number(val) || 0;
    const totalDonations = donorReceipts.reduce((sum, receipt) => sum + (toNumber(receipt.receipt_total_amount) || 0), 0);
  
    const totalMembershipAmount = membershipDetails.reduce((sum, member) => sum + (toNumber(member.receipt_total_amount) || 0), 0);
    
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const currentYearDonations = donorReceipts
      .filter(receipt => receipt.receipt_date && receipt.receipt_date.includes(currentYear))
      .reduce((sum, receipt) => sum + (toNumber(receipt.receipt_total_amount) || 0), 0);

    const previousYearDonations = donorReceipts
    .filter(receipt => receipt.receipt_date && receipt.receipt_date.includes(previousYear.toString()))
    .reduce((sum, receipt) => sum + (toNumber(receipt.receipt_total_amount) || 0), 0);

    const avgDonation = donorReceipts.length > 0 ? totalDonations / donorReceipts.length : 0;
    const largestDonation = donorReceipts.length > 0 ? Math.max(...donorReceipts.map(r => toNumber(r.receipt_total_amount) || 0)) : 0;

    return {
      totalDonations: totalDonations  + totalMembershipAmount,
      currentYearDonations,
      previousYearDonations,
      totalReceipts: donorReceipts.length ,
      totalFamilyMembers: familyDetails.length,
      totalCompanies: companyDetails.length,
      totalMemberships: membershipDetails.length,
      avgDonation,
      largestDonation,
      membershipAmount: totalMembershipAmount,
      donationGrowth: previousYearDonations > 0 ? ((currentYearDonations - previousYearDonations) / previousYearDonations * 100) : 0
    };
  }, [donorData, donorReceiptsData]);

  if (donorLoading || donorReceiptsLoading) {
    return <LoadingSkeleton />;
  }

  if (donorError) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <XCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Error loading donor data</h3>
              <p>{donorError.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { individualCompany, family_details = [], company_details = [], related_group, image_url } = donorData || {};
  // const oldReceipts = oldReceiptsData?.receipts || [];
  const donorReceipts = donorReceiptsData?.donor_receipts || [];
  const membershipDetails = donorReceiptsData?.membership_details || [];

  if (!individualCompany) {
    return <LoadingSkeleton />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'D';
  };

  const getStatusVariant = (status) => {
    return status ? "default" : "secondary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto  space-y-2">
        
        <div className="flex flex-col lg:flex-row gap-3">
          <Card className="lg:w-1/3">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={image_url?.find(img => img.image_for === 'Donor')?.image_url} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 via-yellow-500/20 to-purple-600 text-black text-lg font-bold">
                    {getInitials(individualCompany.indicomp_full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {individualCompany.indicomp_full_name}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <IdCard className="w-4 h-4" />
                    Donor ID: {individualCompany.indicomp_fts_id}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {individualCompany.indicomp_type}
                    </Badge>
                    <Badge variant={getStatusVariant(individualCompany.indicomp_status)}>
                      {individualCompany.indicomp_status ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {individualCompany.indicomp_donor_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:w-2/3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Donor Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(statistics?.totalDonations)}
                  </div>
                  <p className="text-sm text-gray-600">Total Donated</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {statistics?.totalReceipts}
                  </div>
                  <p className="text-sm text-gray-600">Total Receipts</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {statistics?.totalFamilyMembers}
                  </div>
                  <p className="text-sm text-gray-600">Family Members</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {statistics?.totalMemberships}
                  </div>
                  <p className="text-sm text-gray-600">Memberships</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Current Year Donations"
            value={formatCurrency(statistics?.currentYearDonations)}
            icon={<TrendingUp className="h-4 w-4" />}
            description={`${statistics?.donationGrowth?.toFixed(1) || 0}% growth`}
            trend="up"
          />
          <StatCard
            title="Last Year Donation"
            value={formatCurrency(statistics?.previousYearDonations)}
            icon={<BarChart3 className="h-4 w-4" />}
            description="prev transaction"
            trend="neutral"
          />
          <StatCard
            title="Largest Donation"
            value={formatCurrency(statistics?.largestDonation)}
            icon={<Award className="h-4 w-4" />}
            description="Single transaction"
            trend="up"
          />
          <StatCard
            title="Membership Value"
            value={formatCurrency(statistics?.membershipAmount)}
            icon={<Crown className="h-4 w-4" />}
            description="Total membership"
            trend="neutral"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Family ({statistics?.totalFamilyMembers || 0})
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Companies ({statistics?.totalCompanies || 0})
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="membership" className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              Membership
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5" />
                    Recent Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donorReceipts.slice(0, 5).map((receipt, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">#{receipt.receipt_no}</TableCell>
                          <TableCell>{formatDate(receipt.receipt_date)}</TableCell>
                          <TableCell className="font-bold text-green-600">
                            {formatCurrency(receipt.receipt_total_amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Donation</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Upcoming Renewals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {membershipDetails.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Membership #{member.receipt_no}</p>
                          <p className="text-sm text-gray-500">
                            Valid until: {member.m_ship_vailidity || 'N/A'}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {formatCurrency(member.receipt_total_amount)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Family Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Family Members Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {family_details && family_details.length > 0 ? (
                      family_details.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                  {getInitials(member.indicomp_full_name)}
                                </AvatarFallback>
                              </Avatar>
                              {member.indicomp_full_name}
                            </div>
                          </TableCell>
                          <TableCell>{member.indicomp_mobile_phone || 'N/A'}</TableCell>
                          <TableCell>{member.indicomp_email || 'N/A'}</TableCell>
                          <TableCell>
                            {member.indicomp_res_reg_city || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(member.indicomp_status)}>
                              {member.indicomp_status ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No family members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailSection
                      title="Basic Information"
                      icon={<User className="w-4 h-4" />}
                      items={[
                        { label: 'Full Name', value: individualCompany.indicomp_full_name },
                        { label: 'Title', value: individualCompany.title },
                        { label: 'Gender', value: individualCompany.indicomp_gender },
                        { label: 'Date of Birth', value: formatDate(individualCompany.indicomp_dob_annualday) },
                      ]}
                    />
                    <DetailSection
                      title="Identification"
                      icon={<IdCard className="w-4 h-4" />}
                      items={[
                        { label: 'PAN Number', value: individualCompany.indicomp_pan_no },
                        { label: 'Donor Type', value: individualCompany.indicomp_donor_type },
                        { label: 'Member Type', value: individualCompany.indicomp_type },
                        { label: 'Joining Date', value: formatDate(individualCompany.indicomp_joining_date) },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContactItem icon={<Phone />} label="Mobile" value={individualCompany.indicomp_mobile_phone} />
                  <ContactItem icon={<Mail />} label="Email" value={individualCompany.indicomp_email} />
                  <ContactItem icon={<MapPin />} label="Address" 
                    value={`${individualCompany.indicomp_res_reg_city}, ${individualCompany.indicomp_res_reg_state} - ${individualCompany.indicomp_res_reg_pin_code}`} 
                  />
                  <ContactItem icon={<Globe />} label="Correspondence" value={individualCompany.indicomp_corr_preffer} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Family Tab with Advanced Table */}
          <TabsContent value="family" className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>Family Members Management</CardTitle>
                <CardDescription>
                  {statistics?.totalFamilyMembers || 0} family members associated with this donor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Promoter</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {family_details && family_details.length > 0 ? (
                      family_details.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-purple-100 text-purple-800">
                                  {getInitials(member.indicomp_full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.indicomp_full_name}</div>
                                <div className="text-sm text-gray-500">{member.title}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{member.indicomp_mobile_phone}</div>
                              <div className="text-sm text-gray-500">{member.indicomp_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {member.indicomp_res_reg_city}, {member.indicomp_res_reg_state}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(member.indicomp_joining_date)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.indicomp_promoter}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(member.indicomp_status)}>
                              {member.indicomp_status ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                          No family members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>Associated Companies</CardTitle>
                <CardDescription>
                  {statistics?.totalCompanies || 0} companies linked to this donor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company_details && company_details.length > 0 ? (
                      company_details.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-orange-100 text-orange-800">
                                  <Building2 className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{company.indicomp_full_name}</div>
                                <div className="text-sm text-gray-500">{company.indicomp_com_contact_designation}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{company.indicomp_com_contact_name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{company.indicomp_mobile_phone}</div>
                              <div className="text-sm text-gray-500">{company.indicomp_email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{company.indicomp_pan_no}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{company.indicomp_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(company.indicomp_status)}>
                              {company.indicomp_status ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                          No companies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab with Advanced Tables */}
          <TabsContent value="donations" className="space-y-2">
            <div className="grid grid-cols-1  gap-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>
                    {donorReceipts.length} donation receipts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Donor</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donorReceipts.map((receipt, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">#{receipt.receipt_no}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              {formatDate(receipt.receipt_date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                                  {getInitials(receipt.indicomp_full_name)}
                                </AvatarFallback>
                              </Avatar>
                              {receipt.indicomp_full_name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {formatCurrency(receipt.receipt_total_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
                <CardDescription>
                  {statistics?.totalMemberships} membership records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead>Financial Year</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membershipDetails.map((membership) => (
                      <TableRow key={membership.id}>
                        <TableCell className="font-medium">#{membership.receipt_no}</TableCell>
                        <TableCell>{formatDate(membership.receipt_date)}</TableCell>
                        <TableCell className="font-bold text-purple-600">
                          {formatCurrency(membership.receipt_total_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{membership.m_ship_vailidity}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3 h-3" />
                            {membership.receipt_tran_pay_mode}
                          </div>
                        </TableCell>
                        <TableCell>{membership.receipt_financial_year}</TableCell>
                        <TableCell>
                          <Badge variant={membership.tally_status === "False" ? "secondary" : "default"}>
                            {membership.tally_status === "False" ? "Pending" : "Processed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Supporting Components
const StatCard = ({ title, value, icon, description, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DetailSection = ({ title, icon, items }) => (
  <div className="space-y-4">
    <h3 className="font-semibold flex items-center gap-2">
      {icon}
      {title}
    </h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-sm text-gray-500">{item.label}:</span>
          <span className="text-sm font-medium">{item.value || 'N/A'}</span>
        </div>
      ))}
    </div>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-500">{React.cloneElement(icon, { className: "w-4 h-4" })}</div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-sm">{value || 'N/A'}</div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex flex-col lg:flex-row gap-6">
      <Skeleton className="h-32 lg:w-1/3" />
      <Skeleton className="h-32 lg:w-2/3" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <Skeleton className="h-64" />
  </div>
);

export default DonorView;