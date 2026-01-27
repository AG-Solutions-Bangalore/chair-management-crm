import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building, Save, X, Loader2, Info, Upload } from 'lucide-react';
import { fetchViewerEditById, VIEWVER_EDIT_UPDATE } from '@/api';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import BASE_URL from '@/config/base-url';
import { decryptId } from '@/utils/encyrption/encyrption';

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" }
];

const EditViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const descryptedId = decryptId(id)
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    userName: '', 
    contact: '', 
    email: '',

    startDate: '', 
    endDate: '', 
   
    user_position: '', 
    status: '', 
    chapterIds: '',
    viewerId: '',
  
    user_add: "",
    user_birthday: '',
    user_type: "",
    image: null,
    user_school_ids: "",
  });
  
  const [errors, setErrors] = useState({});
  const [selectedChapterIds, setSelectedChapterIds] = useState([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

  
  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters-dropdown'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/chapter`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return response.data.data || [];
    },
  });

  const { data: userTypes = [], isLoading: userTypesLoading } = useQuery({
    queryKey: ['user-types'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/fetch-user-type`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return response.data.data || [];
    },
  });

  const { data: chapterActive = [], isLoading: chapterActiveLoading } = useQuery({
    queryKey: ['chapter-active'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/chapter-active`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return response.data.data || [];
    },
  });

  const { data: viewerData, isLoading: viewerLoading } = useQuery({
    queryKey: ['viewer', id],
    queryFn: () => fetchViewerEditById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (viewerData?.data) {
      const user = viewerData.data;
      const chapterIdsArray = user.viewer_chapter_ids ? user.viewer_chapter_ids.split(',').filter(id => id !== '') : [];
      const schoolIdsArray = user.user_school_ids ? user.user_school_ids.split(',').filter(id => id !== '') : [];
      
      const newFormData = {
        firstName: user.first_name || '', 
        lastName: user.last_name || '', 
        userName: user.name || '',
        contact: user.phone || '', 
        email: user.email || '', 
   
        startDate: user.viewer_start_date || '',
        endDate: user.viewer_end_date || '', 
    
        user_position: user.user_position || '', 
        status: user.user_status || '', 
        chapterIds: user.viewer_chapter_ids || '',
        viewerId: user.id || '',
     
        user_add: user.user_add || "",
        user_birthday: user.user_birthday || '',
        user_type: user.user_type_id?.toString() || "",
        user_school_ids: user.user_school_ids || "",
        image: null
      };
      
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setSelectedChapterIds(chapterIdsArray);
      setSelectedSchoolIds(schoolIdsArray);

 
      if (user.image && user.image !== 'null' && viewerData.image_url) {
        const userImageUrl = viewerData.image_url.find(img => img.image_for === "User")?.image_url;
        if (userImageUrl) {
          const datenow = new Date().getTime(); 
          setCurrentImage(`${userImageUrl}${user.image}`);
          setImagePreview(`${userImageUrl}${user.image}?t=${datenow}`);
        }
      }
    }
  }, [viewerData]);

  useEffect(() => {
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsFormDirty(isDirty);
  }, [formData, initialFormData]);

  // Custom validation function
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
      newErrors.userName = 'Username can only contain letters, numbers, and underscores';
    }

    // Contact validation
    if (!formData.contact.trim()) {
      newErrors.contact = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Mobile number must be exactly 10 digits';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Designation validation
    if (!formData.user_position.trim()) {
      newErrors.user_position = 'Designation is required';
    }

    // Start Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // End Date validation
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    // Birthday validation (optional)
    if (formData.user_birthday && new Date(formData.user_birthday) > new Date()) {
      newErrors.user_birthday = 'Birthday cannot be in the future';
    }

    // Image validation
    if (formData.image) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(formData.image.type)) {
        newErrors.image = 'Please select a valid image (JPEG, PNG, GIF)';
      } else if (formData.image.size > maxSize) {
        newErrors.image = 'Image size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const formDataToSend = new FormData();
      
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key] instanceof File) {
          formDataToSend.append('image', data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
          formDataToSend.append(key, data[key]);
        }
      });
  
      return axios.post(`${BASE_URL}/api/update-user/${descryptedId}?_method=PUT`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data'
        },
      });
    },
    onSuccess: (response) => {
      if (response.data.code === 201) {
        toast.success(response.data.message);
        queryClient.invalidateQueries(['viewers', id]);
       
        navigate('/master/viewer');
      } else if (response.data.code === 400) {
        toast.error(response.data.message);
      } else {
        toast.error('Unexpected error occurred');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update viewer');
    },
  });


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image (JPEG, PNG, GIF)' }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setCurrentImage(null);
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    setCurrentImage(null);
    setErrors(prev => ({ ...prev, image: '' }));
  
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChapterCheckbox = (chapterId, checked) => {
    const newChapterIds = checked
      ? [...selectedChapterIds, chapterId.toString()]
      : selectedChapterIds.filter(id => id !== chapterId.toString());
    
    setSelectedChapterIds(newChapterIds);
    setFormData(prev => ({ ...prev, chapterIds: newChapterIds.join(',') }));
  };

  const handleSchoolCheckbox = (chapterCode, checked) => {
    const newSchoolIds = checked
      ? [...selectedSchoolIds, chapterCode.toString()]
      : selectedSchoolIds.filter(id => id !== chapterCode.toString());
    
    setSelectedSchoolIds(newSchoolIds);
    setFormData(prev => ({ ...prev, user_school_ids: newSchoolIds.join(',') }));
  };

  const handleContactChange = (value) => {
    if (/^\d*$/.test(value) && value.length <= 10) {
      handleInputChange('contact', value);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }
    
    const submitData = {
    
      first_name: formData.firstName,
      last_name: formData.lastName,
      name: formData.userName,
      phone: formData.contact,
      email: formData.email,
      viewer_start_date: formData.startDate,
      viewer_end_date: formData.endDate,
      viewer_chapter_ids: formData.chapterIds,
      user_position: formData.user_position,
      user_status: formData.status,
      user_birthday: formData.user_birthday,
      user_add: formData.user_add,
      user_type: formData.user_type,
      user_school_ids: formData.user_school_ids,
     
      image: formData.image,
    };

    updateMutation.mutate(submitData);
  };

  const isLoading = viewerLoading || chaptersLoading || userTypesLoading || chapterActiveLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading viewer data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-2">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Building className="text-muted-foreground w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-md font-semibold text-gray-900">Edit Viewer Donor</h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Update viewer donor information and details
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
            <Button 
              onClick={() => navigate('/master/viewer')}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </Button>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} noValidate className="space-y-2">
       
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm p-1 rounded-md px-1 font-medium bg-[var(--team-color)] text-white mb-4">
              <Info className="w-4 h-4" />
              Personal Details 
              <span>User : {userTypes.find(type => type.id?.toString() === formData.user_type)?.user_type || 'Viewer'}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* First Name */}
              <div className="">
                <Label htmlFor="firstName" className="text-xs font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className={errors.firstName ? 'border-red-500' : ''}
                  required
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="">
                <Label htmlFor="lastName" className="text-xs font-medium">
                  Last Name 
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>

              {/* Username */}
              <div className="">
                <Label htmlFor="userName" className="text-xs font-medium">
                  Username (Login Name) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  placeholder="Enter username"
                  className={errors.userName ? 'border-red-500' : ''}
                  required
                />
                {errors.userName && (
                  <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="">
                <Label htmlFor="contact" className="text-xs font-medium">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleContactChange(e.target.value)}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  className={errors.contact ? 'border-red-500' : ''}
                  required
                />
                {errors.contact && (
                  <p className="text-xs text-red-500 mt-1">{errors.contact}</p>
                )}
              </div>

              {/* Email */}
              <div className="">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Designation */}
              <div className="">
                <Label htmlFor="user_position" className="text-xs font-medium">
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user_position"
                  value={formData.user_position}
                  onChange={(e) => handleInputChange('user_position', e.target.value)}
                  placeholder="Enter designation"
                  className={errors.user_position ? 'border-red-500' : ''}
                  required
                />
                {errors.user_position && (
                  <p className="text-xs text-red-500 mt-1">{errors.user_position}</p>
                )}
              </div>

              {/* Address */}
              <div className="">
                <Label htmlFor="user_add" className="text-xs font-medium">
                  Address
                </Label>
                <Input
                  id="user_add"
                  value={formData.user_add}
                  onChange={(e) => handleInputChange('user_add', e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              {/* Birthday */}
              <div className="">
                <Label htmlFor="user_birthday" className="text-xs font-medium">
                  Birthday
                </Label>
                <Input
                  id="user_birthday"
                  type="date"
                  value={formData.user_birthday}
                  onChange={(e) => handleInputChange('user_birthday', e.target.value)}
                  className={errors.user_birthday ? 'border-red-500' : ''}
                />
                {errors.user_birthday && (
                  <p className="text-xs text-red-500 mt-1">{errors.user_birthday}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="">
                <Label htmlFor="image" className="text-xs font-medium">
                  Profile Image
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`cursor-pointer ${errors.image ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.image && (
                    <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                  )}
                  {(imagePreview || currentImage) && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative">
                        <img 
                          src={imagePreview || currentImage} 
                          alt="Preview" 
                          className="h-16 w-16 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                          onClick={removeImage}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="text-xs text-green-600">
                        {imagePreview ? "New image selected" : "Current image"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Date */}
              <div className="">
                <Label htmlFor="startDate" className="text-xs font-medium">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                  required
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
                )}
              </div>

              {/* End Date */}
              <div className="">
                <Label htmlFor="endDate" className="text-xs font-medium">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                  required
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
                )}
              </div>

              {/* Status */}
              <div className="">
                <Label htmlFor="status" className="text-xs font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)} 
                  required
                >
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm p-1 rounded-md px-1 font-medium bg-[var(--team-color)] text-white mb-4">
              <Info className="w-4 h-4" />
              Chapter Selection
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              
            </div>

            <div className="space-y-2 mb-6">
              <Label className="text-sm font-medium">Additional Chapter Access</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-50/50"
                  >
                    <Checkbox
                      id={`chapter-${chapter.id}`}
                      checked={selectedChapterIds.includes(chapter.chapter_code.toString())}
                      onCheckedChange={(checked) =>
                        handleChapterCheckbox(chapter.chapter_code, checked)
                      }
                    />
                    <Label
                      htmlFor={`chapter-${chapter.id}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {chapter.chapter_name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">School Chapter Access</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {chapterActive.map((chapter) => (
                  <div key={chapter.id} className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-50/50">
                    <Checkbox
                      id={`school-${chapter.id}`}
                      checked={selectedSchoolIds.includes(chapter.chapter_code.toString())}
                      onCheckedChange={(checked) => handleSchoolCheckbox(chapter.chapter_code, checked)}
                    />
                    <Label htmlFor={`school-${chapter.id}`} className="text-sm font-normal cursor-pointer flex-1">
                      {chapter.chapter_name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/master/viewer')} 
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" /> 
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateMutation.isLoading || !isFormDirty} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {updateMutation.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Viewer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditViewer;