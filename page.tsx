'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Play, FileText, Presentation, Radio, Upload, Trash2, Download,
  ThumbsUp, ThumbsDown, MessageCircle, Eye, LogOut, Shield,
  Plus, Search, Heart, X, CheckCircle, Video, ChevronDown, ChevronUp,
  FolderOpen, LayoutGrid, List, UserPlus, LogIn, KeyRound, Users, Settings
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ==================== TYPES ====================
interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface ContentItem {
  id: string
  title: string
  description: string | null
  type: string
  fileUrl: string | null
  liveUrl: string | null
  fileName: string | null
  fileSize: number | null
  views: number
  createdAt: string
  comments: CommentItem[]
  likesCount: number
  dislikesCount: number
  _count?: { comments: number; likes: number }
}

interface CommentItem {
  id: string
  text: string
  userId: string
  userName: string | null
  contentId: string
  createdAt: string
}

// ==================== HELPERS ====================
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return 'N/A'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'video': return <Video className="h-5 w-5" />
    case 'pdf': return <FileText className="h-5 w-5" />
    case 'ppt': return <Presentation className="h-5 w-5" />
    case 'live': return <Radio className="h-5 w-5" />
    default: return <FileText className="h-5 w-5" />
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'video': return 'bg-rose-500/10 text-rose-600 border-rose-200'
    case 'pdf': return 'bg-amber-500/10 text-amber-600 border-amber-200'
    case 'ppt': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    case 'live': return 'bg-purple-500/10 text-purple-600 border-purple-200'
    default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
  }
}

function getTypeBadgeColor(type: string) {
  switch (type) {
    case 'video': return 'bg-rose-100 text-rose-700 hover:bg-rose-100'
    case 'pdf': return 'bg-amber-100 text-amber-700 hover:bg-amber-100'
    case 'ppt': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
    case 'live': return 'bg-purple-100 text-purple-700 hover:bg-purple-100'
    default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
  }
}

// ==================== TOAST ====================
function ToastDemo({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) {
  const { toast } = useToast()
  useEffect(() => {
    toast({ title: message, variant: type === 'error' ? 'destructive' : 'default' })
  }, [])
  return null
}

// ==================== LOGIN PAGE ====================
function LoginPage({ onLogin, onRegister }: { onLogin: (user: User) => void; onRegister: (user: User) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin ? { email, password } : { email, password, name }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setToastMsg({ message: data.error || 'Something went wrong', type: 'error' })
        setLoading(false)
        return
      }

      if (isLogin) {
        onLogin(data)
      } else {
        setToastMsg({ message: 'Registration successful! Please login.', type: 'success' })
        setIsLogin(true)
      }
    } catch (error) {
      setToastMsg({ message: 'Network error. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {toastMsg && <ToastDemo message={toastMsg.message} type={toastMsg.type} />}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Play className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">MediaHub</CardTitle>
          <CardDescription className="text-slate-400">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-rose-500/50"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-rose-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-rose-500/50"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-rose-500/25 transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </span>
              ) : isLogin ? (
                <span className="flex items-center gap-2"><LogIn className="h-4 w-4" /> Sign In</span>
              ) : (
                <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Create Account</span>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-rose-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

// ==================== ADMIN PANEL ====================
function AdminPanel({ user, onLogout, onUpdateUser }: { user: User; onLogout: () => void; onUpdateUser: (u: User) => void }) {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', type: 'video', file: null as File | null, liveUrl: ''
  })

  // User management state
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [showUserMgmt, setShowUserMgmt] = useState(false)
  const [showChangeOwnPwd, setShowChangeOwnPwd] = useState(false)
  const [ownPwdForm, setOwnPwdForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [changingOwnPwd, setChangingOwnPwd] = useState(false)
  const [resetPwdFor, setResetPwdFor] = useState<string | null>(null)
  const [resetPwdValue, setResetPwdValue] = useState('')
  const [resettingPwd, setResettingPwd] = useState(false)

  const fetchContents = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      setContents(data)
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setAllUsers(data)
    } catch (error) {
      console.error('Fetch users error:', error)
    }
  }, [])

  useEffect(() => { fetchContents(); fetchUsers() }, [fetchContents, fetchUsers])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('type', uploadForm.type)
      if (uploadForm.type === 'live' && uploadForm.liveUrl) {
        formData.append('liveUrl', uploadForm.liveUrl)
      }
      if (uploadForm.file && uploadForm.type !== 'live') {
        formData.append('file', uploadForm.file)
      }

      const res = await fetch('/api/content', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setToastMsg({ message: data.error || 'Upload failed', type: 'error' })
      } else {
        setToastMsg({ message: 'Content uploaded successfully!', type: 'success' })
        setUploadForm({ title: '', description: '', type: 'video', file: null, liveUrl: '' })
        setShowUploadForm(false)
        fetchContents()
      }
    } catch (error) {
      setToastMsg({ message: 'Upload failed. Please try again.', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return
    try {
      const res = await fetch(`/api/content/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setToastMsg({ message: 'Content deleted', type: 'success' })
        fetchContents()
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to delete', type: 'error' })
    }
  }

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (ownPwdForm.newPwd !== ownPwdForm.confirm) {
      setToastMsg({ message: 'New passwords do not match', type: 'error' })
      return
    }
    setChangingOwnPwd(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword: ownPwdForm.current, newPassword: ownPwdForm.newPwd }),
      })
      if (res.ok) {
        setToastMsg({ message: 'Password changed successfully!', type: 'success' })
        setShowChangeOwnPwd(false)
        setOwnPwdForm({ current: '', newPwd: '', confirm: '' })
      } else {
        const data = await res.json()
        setToastMsg({ message: data.error || 'Failed to change password', type: 'error' })
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to change password', type: 'error' })
    } finally {
      setChangingOwnPwd(false)
    }
  }

  const handleAdminResetPassword = async (targetUserId: string) => {
    if (!resetPwdValue || resetPwdValue.length < 6) {
      setToastMsg({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }
    setResettingPwd(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, newPassword: resetPwdValue, adminId: user.id }),
      })
      if (res.ok) {
        setToastMsg({ message: 'Password reset successfully!', type: 'success' })
        setResetPwdFor(null)
        setResetPwdValue('')
      } else {
        const data = await res.json()
        setToastMsg({ message: data.error || 'Failed to reset password', type: 'error' })
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to reset password', type: 'error' })
    } finally {
      setResettingPwd(false)
    }
  }

  const handleDeleteUser = async (targetUserId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/users?userId=${targetUserId}&adminId=${user.id}`, { method: 'DELETE' })
      if (res.ok) {
        setToastMsg({ message: 'User deleted', type: 'success' })
        fetchUsers()
      } else {
        const data = await res.json()
        setToastMsg({ message: data.error || 'Failed to delete user', type: 'error' })
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to delete user', type: 'error' })
    }
  }

  const stats = {
    total: contents.length,
    videos: contents.filter(c => c.type === 'video').length,
    pdfs: contents.filter(c => c.type === 'pdf').length,
    ppts: contents.filter(c => c.type === 'ppt').length,
    lives: contents.filter(c => c.type === 'live').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {toastMsg && <ToastDemo message={toastMsg.message} type={toastMsg.type} />}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MediaHub</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">
              <Shield className="h-3 w-3 mr-1" /> Admin
            </Badge>
            <span className="text-sm text-slate-300 hidden sm:block">{user.name || user.email}</span>
            <Button variant="ghost" size="sm" onClick={() => setShowChangeOwnPwd(true)} className="text-slate-400 hover:text-white hover:bg-white/5" title="Change Password">
              <KeyRound className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUserMgmt(!showUserMgmt)} className="text-slate-400 hover:text-white hover:bg-white/5" title="Manage Users">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-400 hover:text-white hover:bg-white/5">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Change Own Password Dialog */}
        <Dialog open={showChangeOwnPwd} onOpenChange={setShowChangeOwnPwd}>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-rose-400" /> Change My Password</DialogTitle>
              <DialogDescription className="text-slate-400">Update your admin account password</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangeOwnPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Current Password</label>
                <Input type="password" value={ownPwdForm.current} onChange={(e) => setOwnPwdForm({ ...ownPwdForm, current: e.target.value })} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">New Password</label>
                <Input type="password" value={ownPwdForm.newPwd} onChange={(e) => setOwnPwdForm({ ...ownPwdForm, newPwd: e.target.value })} required minLength={6} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                <Input type="password" value={ownPwdForm.confirm} onChange={(e) => setOwnPwdForm({ ...ownPwdForm, confirm: e.target.value })} required minLength={6} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowChangeOwnPwd(false)} className="border-white/10 text-slate-300">Cancel</Button>
                <Button type="submit" disabled={changingOwnPwd} className="bg-gradient-to-r from-rose-500 to-purple-600 text-white">
                  {changingOwnPwd ? 'Changing...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* User Management Panel */}
        {showUserMgmt && (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-rose-400" />
                  <CardTitle className="text-white">User Management</CardTitle>
                  <Badge variant="secondary" className="bg-white/10 text-slate-300">{allUsers.length} users</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowUserMgmt(false)} className="border-white/10 text-slate-300 hover:bg-white/5">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-white text-sm ${u.role === 'admin' ? 'bg-gradient-to-br from-rose-500 to-purple-600' : 'bg-gradient-to-br from-slate-500 to-slate-700'}`}>
                        {u.name?.charAt(0) || u.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">{u.name || u.email}</h3>
                        <Badge variant="secondary" className={u.role === 'admin' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/10 text-slate-400'}>
                          {u.role === 'admin' ? 'ADMIN' : 'USER'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{u.email} &middot; Joined {formatDate(u.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      {/* Reset Password */}
                      {resetPwdFor === u.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="password"
                            placeholder="New password"
                            value={resetPwdValue}
                            onChange={(e) => setResetPwdValue(e.target.value)}
                            className="h-8 w-32 bg-white/5 border-white/10 text-white text-xs"
                          />
                          <Button size="sm" onClick={() => handleAdminResetPassword(u.id)} disabled={resettingPwd} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2">
                            {resettingPwd ? '...' : 'Save'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setResetPwdFor(null); setResetPwdValue('') }} className="h-8 text-slate-400">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setResetPwdFor(u.id)}
                          className="text-slate-500 hover:text-amber-400 hover:bg-amber-500/10"
                          title="Reset Password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Delete User (not self) */}
                      {u.id !== user.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'from-rose-500 to-pink-600' },
            { label: 'Videos', value: stats.videos, color: 'from-violet-500 to-purple-600' },
            { label: 'PDFs', value: stats.pdfs, color: 'from-amber-500 to-orange-600' },
            { label: 'Live', value: stats.lives, color: 'from-emerald-500 to-teal-600' },
          ].map(s => (
            <Card key={s.label} className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent {s.color}" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                  <span className={s.color.includes('rose') ? 'text-rose-400' : s.color.includes('violet') ? 'text-violet-400' : s.color.includes('amber') ? 'text-amber-400' : 'text-emerald-400'}>{s.value}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Section */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-rose-400" />
                <CardTitle className="text-white">Upload Content</CardTitle>
              </div>
              <Button
                onClick={() => setShowUploadForm(!showUploadForm)}
                variant="outline"
                size="sm"
                className="border-white/10 text-slate-300 hover:bg-white/5"
              >
                {showUploadForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showUploadForm ? 'Cancel' : 'New Upload'}
              </Button>
            </div>
          </CardHeader>
          {showUploadForm && (
            <CardContent className="pt-0">
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Title *</label>
                    <Input
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      placeholder="Enter content title"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Type *</label>
                    <Select value={uploadForm.type} onValueChange={(v) => setUploadForm({ ...uploadForm, type: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">🎥 Video</SelectItem>
                        <SelectItem value="pdf">📄 PDF</SelectItem>
                        <SelectItem value="ppt">📊 PPT</SelectItem>
                        <SelectItem value="live">📡 Live Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <Textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Brief description of the content..."
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                {uploadForm.type === 'live' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Live Stream URL *</label>
                    <Input
                      value={uploadForm.liveUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, liveUrl: e.target.value })}
                      placeholder="https://youtube.com/live/..."
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Upload File *</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-rose-500/30 transition-colors">
                      <input
                        type="file"
                        accept={uploadForm.type === 'video' ? 'video/*' : uploadForm.type === 'pdf' ? '.pdf' : uploadForm.type === 'ppt' ? '.ppt,.pptx' : '*'}
                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {uploadForm.file ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-400">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm">{uploadForm.file.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 text-slate-500 mx-auto" />
                            <p className="text-sm text-slate-400">Click to upload file</p>
                            <p className="text-xs text-slate-500">
                              {uploadForm.type === 'video' ? 'MP4, MOV, AVI...' : uploadForm.type === 'pdf' ? 'PDF files' : 'PPT, PPTX files'}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25"
                >
                  {uploading ? 'Uploading...' : 'Upload Content'}
                </Button>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Content List */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-rose-400" />
              <CardTitle className="text-white">All Content</CardTitle>
              <Badge variant="secondary" className="ml-auto bg-white/10 text-slate-300">
                {contents.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : contents.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No content uploaded yet. Click "New Upload" to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contents.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <Badge variant="secondary" className={getTypeBadgeColor(item.type)}>
                          {item.type.toUpperCase()}
                        </Badge>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.views}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {item._count?.comments || 0}</span>
                        <span className="hidden sm:block">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// ==================== USER PANEL ====================
function UserPanel({ user, onLogout, onUpdateUser }: { user: User; onLogout: () => void; onUpdateUser: (u: User) => void }) {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentText, setCommentText] = useState('')
  const [likesCount, setLikesCount] = useState(0)
  const [dislikesCount, setDislikesCount] = useState(0)
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showChangePwd, setShowChangePwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [changingPwd, setChangingPwd] = useState(false)

  const fetchContents = useCallback(async () => {
    try {
      const url = activeTab === 'all' ? '/api/content' : `/api/content?type=${activeTab}`
      const res = await fetch(url)
      const data = await res.json()
      setContents(data)
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => { fetchContents() }, [fetchContents])

  const openContent = async (item: ContentItem) => {
    try {
      const res = await fetch(`/api/content/${item.id}`)
      const data = await res.json()
      setSelectedContent(data)
      setComments(data.comments || [])
      setLikesCount(data.likesCount || 0)
      setDislikesCount(data.dislikesCount || 0)

      // Get user's reaction
      const reactionRes = await fetch(`/api/content/${item.id}/like?userId=${user.id}`)
      const reactionData = await reactionRes.json()
      setUserReaction(reactionData.reaction)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || !selectedContent) return

    try {
      const res = await fetch(`/api/content/${selectedContent.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText, userId: user.id, userName: user.name }),
      })
      const data = await res.json()
      if (res.ok) {
        setComments(prev => [data, ...prev])
        setCommentText('')
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to add comment', type: 'error' })
    }
  }

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!selectedContent) return

    try {
      const res = await fetch(`/api/content/${selectedContent.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, userId: user.id }),
      })
      const data = await res.json()

      if (data.action === 'created' || data.action === 'switched') {
        setUserReaction(type)
        setLikesCount(data.likesCount ?? likesCount + (type === 'like' ? 1 : 0))
        setDislikesCount(data.dislikesCount ?? dislikesCount + (type === 'dislike' ? 1 : 0))
      } else if (data.action === 'removed') {
        setUserReaction(null)
        setLikesCount(prev => type === 'like' ? prev - 1 : prev)
        setDislikesCount(prev => type === 'dislike' ? prev - 1 : prev)
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to process reaction', type: 'error' })
    }
  }

  const handleDownload = () => {
    if (selectedContent?.fileUrl) {
      window.open(selectedContent.fileUrl, '_blank')
      setToastMsg({ message: 'Download started!', type: 'success' })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setToastMsg({ message: 'New passwords do not match', type: 'error' })
      return
    }
    setChangingPwd(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword: pwdForm.current, newPassword: pwdForm.newPwd }),
      })
      if (res.ok) {
        setToastMsg({ message: 'Password changed successfully!', type: 'success' })
        setShowChangePwd(false)
        setPwdForm({ current: '', newPwd: '', confirm: '' })
      } else {
        const data = await res.json()
        setToastMsg({ message: data.error || 'Failed to change password', type: 'error' })
      }
    } catch (error) {
      setToastMsg({ message: 'Failed to change password', type: 'error' })
    } finally {
      setChangingPwd(false)
    }
  }

  const filteredContents = contents.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {toastMsg && <ToastDemo message={toastMsg.message} type={toastMsg.type} />}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MediaHub</h1>
              <p className="text-xs text-slate-400">Content Library</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                {user.name?.charAt(0) || user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-300 hidden sm:block">{user.name || user.email}</span>
            <Button variant="ghost" size="sm" onClick={() => setShowChangePwd(true)} className="text-slate-400 hover:text-white hover:bg-white/5" title="Change Password">
              <KeyRound className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-400 hover:text-white hover:bg-white/5">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10">
              {[
                { value: 'all', label: 'All', icon: LayoutGrid },
                { value: 'video', label: 'Videos', icon: Video },
                { value: 'pdf', label: 'PDFs', icon: FileText },
                { value: 'ppt', label: 'PPTs', icon: Presentation },
                { value: 'live', label: 'Live', icon: Radio },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-white/10">
                  <tab.icon className="h-3.5 w-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-72 bg-white/5 rounded-2xl" />
            ))}
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No content found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContents.map(item => (
              <Card
                key={item.id}
                className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => openContent(item)}
              >
                {/* Thumbnail/Preview Area */}
                <div className={`h-44 flex items-center justify-center ${getTypeColor(item.type)} relative`}>
                  <div className="text-6xl opacity-30">
                    {item.type === 'video' ? '🎥' : item.type === 'pdf' ? '📄' : item.type === 'ppt' ? '📊' : '📡'}
                  </div>
                  <Badge className="absolute top-3 right-3" variant="secondary">
                    {getTypeIcon(item.type)}
                    <span className="ml-1.5">{item.type.toUpperCase()}</span>
                  </Badge>
                  {item.type === 'live' && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white text-[10px] animate-pulse">● LIVE</Badge>
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.views}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {item.likesCount}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {item._count?.comments || 0}</span>
                    </div>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showChangePwd} onOpenChange={setShowChangePwd}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-rose-400" /> Change My Password</DialogTitle>
            <DialogDescription className="text-slate-400">Update your account password</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Current Password</label>
              <Input type="password" value={pwdForm.current} onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })} required className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">New Password</label>
              <Input type="password" value={pwdForm.newPwd} onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })} required minLength={6} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
              <Input type="password" value={pwdForm.confirm} onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })} required minLength={6} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowChangePwd(false)} className="border-white/10 text-slate-300">Cancel</Button>
              <Button type="submit" disabled={changingPwd} className="bg-gradient-to-r from-rose-500 to-purple-600 text-white">
                {changingPwd ? 'Changing...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Content Detail Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10 text-white">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={getTypeBadgeColor(selectedContent.type)}>
                    {getTypeIcon(selectedContent.type)}
                    <span className="ml-1.5">{selectedContent.type.toUpperCase()}</span>
                  </Badge>
                  <span className="text-xs text-slate-500">{formatDate(selectedContent.createdAt)}</span>
                </div>
                <DialogTitle className="text-xl">{selectedContent.title}</DialogTitle>
                {selectedContent.description && (
                  <DialogDescription className="text-slate-400">{selectedContent.description}</DialogDescription>
                )}
              </DialogHeader>

              {/* Content Viewer */}
              <div className="rounded-xl overflow-hidden bg-black/30 border border-white/10">
                {selectedContent.type === 'video' && selectedContent.fileUrl && (
                  <video
                    controls
                    className="w-full max-h-96 object-contain bg-black"
                    src={selectedContent.fileUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {selectedContent.type === 'live' && selectedContent.liveUrl && (
                  <div className="p-8 text-center">
                    <Radio className="h-12 w-12 text-purple-400 mx-auto mb-3 animate-pulse" />
                    <p className="text-purple-300 font-medium">Live Stream Active</p>
                    <a
                      href={selectedContent.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                    >
                      <Play className="h-4 w-4" /> Watch Live Stream
                    </a>
                  </div>
                )}
                {selectedContent.type === 'pdf' && (
                  <div className="p-8 text-center">
                    <FileText className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                    <p className="text-amber-300 font-medium text-lg">{selectedContent.fileName || 'Document'}</p>
                    <p className="text-slate-400 text-sm mt-1">{formatFileSize(selectedContent.fileSize)}</p>
                    <Button
                      onClick={handleDownload}
                      className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                  </div>
                )}
                {selectedContent.type === 'ppt' && (
                  <div className="p-8 text-center">
                    <Presentation className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <p className="text-emerald-300 font-medium text-lg">{selectedContent.fileName || 'Presentation'}</p>
                    <p className="text-slate-400 text-sm mt-1">{formatFileSize(selectedContent.fileSize)}</p>
                    <Button
                      onClick={handleDownload}
                      className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download PPT
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats & Actions */}
              <div className="flex flex-wrap items-center gap-4 py-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Eye className="h-4 w-4" />
                  <span>{selectedContent.views} views</span>
                </div>
                <Separator orientation="vertical" className="h-6 bg-white/10" />

                {/* Like / Dislike */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction('like')}
                    className={`gap-1.5 ${userReaction === 'like' ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction('dislike')}
                    className={`gap-1.5 ${userReaction === 'dislike' ? 'text-red-400 bg-red-500/10 hover:bg-red-500/15' : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'}`}
                  >
                    <ThumbsDown className={`h-4 w-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
                    <span>{dislikesCount}</span>
                  </Button>
                </div>

                {selectedContent.type !== 'live' && selectedContent.fileUrl && (
                  <>
                    <Separator orientation="vertical" className="h-6 bg-white/10" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="border-white/10 text-slate-300 hover:bg-white/5 gap-1.5"
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </>
                )}
              </div>

              <Separator className="bg-white/10" />

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-rose-400" />
                  Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                    <Button
                      onClick={handleComment}
                      size="icon"
                      className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <ScrollArea className="max-h-72">
                  <div className="space-y-3 pr-4">
                    {comments.length === 0 ? (
                      <p className="text-center text-slate-500 py-6">No comments yet. Be the first to comment!</p>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-white/5">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-700 text-white text-[10px]">
                              {comment.userName?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{comment.userName || 'User'}</span>
                              <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== MAIN APP ====================
function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const savedUser = localStorage.getItem('mediahub_user')
    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    return null
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(getInitialUser)
  const [mounted] = useState(true)

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('mediahub_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('mediahub_user')
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('mediahub_user', JSON.stringify(updatedUser))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500/30 border-t-rose-500" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} onRegister={handleLogin} />
  }

  if (user.role === 'admin') {
    return <AdminPanel user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
  }

  return <UserPanel user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
}
