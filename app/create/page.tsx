import InviteForm from "@/components/invite-form"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Light mode green circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl dark:opacity-0"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl dark:opacity-0"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl dark:opacity-0"></div>

        {/* Dark mode purple circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl opacity-0 dark:opacity-100"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent mb-4">
              Create Stunning Travel Invites
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create stunning travel invitations with cinematic backgrounds and share your next adventure in style
            </p>
          </div>
          <InviteForm />
        </div>
      </div>
    </div>
  )
}
