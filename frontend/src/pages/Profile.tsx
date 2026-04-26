import { useRef } from "react";
import { CircleUserRound, Camera, Mail, User, Shield, Save, Loader } from "lucide-react";
import { useProfile } from "../hooks/useProfile";

export function Profile() {
    const {
        currentUser,
        firstName, setFirstName,
        lastName, setLastName,
        avatarPreview,
        saving, success, error,
        handleAvatarChange, handleSave,
        isDirty, roleBadgeStyle,
    } = useProfile();

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="p-6 max-w-2xl">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-8">
                <div className="font-bold text-3xl">My Profile</div>
                <div className="text-gray-500 text-sm">
                    View and update your personal information.
                </div>
            </div>

            {/* Avatar card */}
            <div className="bg-[#F9FAFA] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="avatar"
                                className="w-24 h-24 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <CircleUserRound size={60} className="text-gray-400" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-[#3899FA] text-white rounded-full p-1.5 shadow-md hover:bg-blue-500 transition-colors cursor-pointer"
                        title="Change photo"
                    >
                        <Camera size={14} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>

                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <div className="font-bold text-xl">
                        {currentUser?.first_name} {currentUser?.last_name}
                    </div>
                    <div className="text-gray-500 text-sm">{currentUser?.email}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit mx-auto sm:mx-0 capitalize ${roleBadgeStyle}`}>
                        {currentUser?.role}
                    </span>
                </div>
            </div>

            {/* Form card */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                <div className="bg-[#F9FAFA] px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="font-medium text-sm">Personal Information</span>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3899FA] transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3899FA] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            Email Address
                        </label>
                        <div className="border border-gray-100 bg-[#F9FAFA] rounded-lg px-3 py-2 text-sm text-gray-400 select-none">
                            {currentUser?.email}
                        </div>
                        <span className="text-xs text-gray-400">Email cannot be changed.</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Shield size={12} />
                            Role
                        </label>
                        <div className="border border-gray-100 bg-[#F9FAFA] rounded-lg px-3 py-2 text-sm text-gray-400 capitalize select-none">
                            {currentUser?.role}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-4">{success}</div>}

            {/* Save */}
            <button
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="flex items-center gap-2 bg-[#3899FA] text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {saving ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
