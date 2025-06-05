import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changeUserPassword, getUserById, updateUserProfile } from '../services/userService';
import Avatar from '../components/Avatar';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { t } from "i18next";

export interface UserData {
  name: string;
  surname: string;
  email: string;
  location: string;
  profileImage?: string;
}

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    surname: "",
    email: "",
    location: "",
    profileImage: "",
  });
  const [originalUserData, setOriginalUserData] = useState<UserData | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const user = await getUserById(userId);
      const data: UserData = {
        name: user.name,
        surname: user.surname,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
      };
      setUserData(data);
      setOriginalUserData(data);
      console.log(data);
    };
    fetchUser();
  }, [userId]);

  

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const getModifiedFields = (
    original: UserData,
    updated: UserData
  ): Partial<UserData> => {
    const changes: Partial<UserData> = {};
    (Object.keys(updated) as (keyof UserData)[]).forEach((key) => {
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    });
    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!originalUserData || !userId) return;

  if (password.new || password.confirm || password.current) {
    if (password.new !== password.confirm) {
      alert(t("passwords_do_not_match"));
      return;
    }
  }

  try {
    const modifiedFields = getModifiedFields(originalUserData, userData);
    const hasImageChange = imageFile !== null;

    if (Object.keys(modifiedFields).length > 0 || hasImageChange) {
      await updateUserProfile(userId, modifiedFields, imageFile ?? undefined);
    }

    if (password.current && password.new && password.confirm) {
      await changeUserPassword(userId, {
        currentPassword: password.current,
        newPassword: password.new,
      });
    }

    // ✅ Volvemos a obtener el usuario actualizado
    const updatedUser = await getUserById(userId);
    const data: UserData = {
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      location: updatedUser.location,
      profileImage: updatedUser.profileImage,
    };

    setUserData(data);
    setOriginalUserData(data);
    setIsEditing(false);
    setPassword({ current: "", new: "", confirm: "" });
    setImageFile(null);
    toast.success(t("profile_updated_success"));
  } catch (err: any) {
    alert(err.message || t("unknown_error"));
  }
};


  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{t("profile")}</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isEditing ? t("cancel") : t("edit-profile")}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <div className="relative" onClick={handleImageClick}>
                {userData.profileImage ? (
                  <img
                    src={`http://localhost:8080${userData.profileImage}`}
                    alt="Foto de perfil"
                    className="w-48 h-48 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <Avatar
                    src=""
                    alt="Foto de perfil"
                    size={192}
                    className="shadow-md"
                  />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-full cursor-pointer">
                    <span className="text-sm font-medium">{t("change_photo")}</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <form onSubmit={handleSubmit} className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("surname")}
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={userData.surname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("location")}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={userData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Cambiar Contraseña
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name={name}
                          value={(password as any)[name]}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
