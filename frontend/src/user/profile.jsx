import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ExternalLinkIcon } from 'lucide-react';
import EnhancedBookLoader from '../components/BookLoader';

function Profile() {
 const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token'); // Get token from local storage
    
    if (!token) {
      toast.error('No token found');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://acadmate-backend.onrender.com/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Unauthorized');

      const data = await res.json();
      setProfile(data.user);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array since we're not using Redux token anymore

  if (loading) {
    return <EnhancedBookLoader/>
  }
  if (!profile) {
    return <div className="text-center mt-10 text-red-500">Failed to load profile</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Profile</h2>
      <div className="space-y-3 text-gray-700 dark:text-gray-200 mb-6">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>College:</strong> {profile.collegeName}</p>
        <p><strong>Branch:</strong> {profile.branch}</p>
        <p><strong>Program:</strong> {profile.program}</p>
      </div>

      {/* Uploaded Files */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Your Saved Files</h3>
        {profile.files && profile.files.length > 0 ? (
          <ul className="space-y-3">
            {profile.files.map((file) => (
              <li
                key={file._id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="text-gray-800 dark:text-gray-200">
                  {file.fileName}
                </div>
                <a
                  href={`https://acadmate-backend.onrender.com/api/materials/view/${file.fileSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No uploaded files found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
