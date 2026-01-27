import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, Mail, Calendar, ArrowRight, Eye, Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { MEMBER_DASHBOARD, SEND_BULK_EMAIL } from '@/api';

const MemberDashboard = () => {
  const token = Cookies.get('token');
  const userType = Cookies.get('user_type_id');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['member-dashboard'],
    queryFn: async () => {
      const response = await axios.get(MEMBER_DASHBOARD, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    },
    retry: 2,
    staleTime: 30 * 60 * 1000,
   cacheTime: 60 * 60 * 1000,
   refetchOnMount: false,
   refetchOnWindowFocus: false,
   refetchOnReconnect: false,
  });

  const sendBulkEmailMutation = useMutation({
    mutationFn: async (year) => {
      const membersForYear = dashboardData?.individualCompanies?.filter(
        member => member.last_payment_vailidity === year
      ) || [];

      const emailData = membersForYear.map(member => ({
        indicomp_id: member.id,
        member_vailidity: member.last_payment_vailidity
      }));

      const response = await axios.post(
        SEND_BULK_EMAIL,
        { member_email_data: emailData },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: (data, year) => {
      toast.success(`Emails sent successfully for ${year} members`);
    },
    onError: (error, year) => {
      toast.error(`Failed to send emails for ${year}`);
      console.error('Email sending error:', error);
    }
  });

  const members = dashboardData?.data || [];
  const memberEmailStats = dashboardData?.memberEmail || [];

  const membersByYear = members.reduce((acc, member) => {
    const year = member.last_payment_vailidity;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(member);
    return acc;
  }, {});

  const filteredYears = Object.keys(membersByYear)
    .filter(year => 
      year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membersByYear[year].some(member => 
        member.indicomp_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.indicomp_email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => b - a);

  const handleYearCardClick = (year) => {
    const membersForYear = membersByYear[year] || [];
    const serializedMembers = encodeURIComponent(btoa(JSON.stringify(membersForYear)));
    navigate(`/member-list?year=${year}&members=${serializedMembers}`);
  };

  const handleViewAllMembers = () => {
    const serializedMembers = encodeURIComponent(btoa(JSON.stringify(members)));
    navigate(`/member-list?year=all&members=${serializedMembers}`);
  };

  const handleSendEmail = (year, e) => {
    e.stopPropagation();
    
    const membersForYear = membersByYear[year] || [];
    const membersWithoutEmail = membersForYear.filter(
      member => !member.indicomp_email || member.indicomp_email.trim() === ""
    );

    if (membersWithoutEmail.length > 0) {
      toast.error("Some members do not have an email. Please add their emails first.");
      return;
    }

    sendBulkEmailMutation.mutate(year);
  };

  const getEmailStats = (year) => {
    const stats = memberEmailStats.find(stat => stat.member_vailidity === year);
    return stats || { sent: 0, notsent: 0 };
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-6 w-10" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="text-blue-600 w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Member Dashboard</h1>
              <p className="text-sm text-gray-500">
                Manage members across different years
              </p>
            </div>
          </div>
          <Button 
            onClick={handleViewAllMembers}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View All
          </Button>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow p-4"
          onClick={handleViewAllMembers}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Members</p>
              <h3 className="text-lg font-semibold">{members.length}</h3>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Active Years</p>
              <h3 className="text-lg font-semibold">{Object.keys(membersByYear).length}</h3>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Emails Sent</p>
              <h3 className="text-lg font-semibold">
                {memberEmailStats.reduce((total, stat) => total + stat.sent, 0)}
              </h3>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-600">
              <Mail className="w-4 h-4 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Pending Emails</p>
              <h3 className="text-lg font-semibold">
                {memberEmailStats.reduce((total, stat) => total + stat.notsent, 0)}
              </h3>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600">
              <Download className="w-4 h-4 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Membership Validity by Year */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                <Calendar className="text-green-600 w-3 h-3" />
              </div>
              <div>
                <CardTitle className="text-base">Membership by Year</CardTitle>
                <CardDescription className="text-xs">
                  Manage members and send communications
                </CardDescription>
              </div>
            </div>
            
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2 top-2 h-3 w-3 text-gray-500" />
              <Input
                placeholder="Search years or members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredYears.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredYears.map(year => {
  const yearMembers = membersByYear[year] || [];
  const emailStats = getEmailStats(year);
  
 
  const yearExistsInMemberEmail = Array.isArray(memberEmailStats) &&
    memberEmailStats.some(stat => String(stat.member_vailidity) === String(year));
  


  return (
    <Card 
      key={year}
      className="cursor-pointer hover:shadow-md transition-shadow border p-3"
      onClick={() => handleYearCardClick(year)}
    >
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-semibold">Year {year}</h3>
            <p className="text-xs text-gray-500">
              {yearMembers.length} member{yearMembers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {yearMembers.length}
          </Badge>
        </div>

        {/* Email Statistics */}
        <div className="flex gap-3 mb-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-green-700">{emailStats.sent} sent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span className="text-red-700">{emailStats.notsent} pending</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
       
          {(!yearExistsInMemberEmail && userType !== '4') && (
            <Button
              onClick={(e) => handleSendEmail(year, e)}
              disabled={sendBulkEmailMutation.isPending}
              size="sm"
              variant="outline"
              className="flex items-center gap-1 h-7 text-xs"
            >
              <Mail className="w-3 h-3" />
              {sendBulkEmailMutation.isPending ? 'Sending...' : 'Email'}
            </Button>
          )}
          
          <div className="flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors">
            View
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
})}

            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 text-sm mb-1">No membership data found</p>
              <p className="text-gray-400 text-xs">
                {searchTerm ? 'Try adjusting your search terms' : 'No membership years available'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Members Table */}
      {members.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Members</CardTitle>
            <CardDescription className="text-xs">
              Latest member registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-8 text-xs">Name</TableHead>
                    <TableHead className="h-8 text-xs">Email</TableHead>
                    <TableHead className="h-8 text-xs">Type</TableHead>
                    <TableHead className="h-8 text-xs">Chapter</TableHead>
                    <TableHead className="h-8 text-xs">Validity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.slice(0, 5).map((member) => (
                    <TableRow key={member.id} className="h-10">
                      <TableCell className="text-xs font-medium py-2">
                        {member.indicomp_full_name}
                      </TableCell>
                      <TableCell className="text-xs py-2">{member.indicomp_email}</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-xs">
                          {member.indicomp_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs py-2">{member.chapter_name}</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="secondary" className="text-xs">
                          {member.last_payment_vailidity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberDashboard;