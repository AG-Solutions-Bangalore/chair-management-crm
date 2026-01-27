import { CREATE_FOLLOWUP_API_URL } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';




const useCreateFollowup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      
      const token = Cookies.get('token'); 
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.post(CREATE_FOLLOWUP_API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success('Follow-up created successfully!');
      queryClient.invalidateQueries(['followups']);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create follow-up. Please try again.';
      toast.error(message);
    },
  });

  return mutation;
};

export default useCreateFollowup;
