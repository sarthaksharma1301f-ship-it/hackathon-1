// Creator Gig Marketplace - Main React Application
const { useState, useEffect, useMemo } = React;

function App() {
  // Storage & State Initialization
  const [users, setUsers] = useState(() => window.CGM_STORAGE.getUsers());
  const [activeUserId, setActiveUserId] = useState(() => window.CGM_STORAGE.getActiveUserId());
  const [gigs, setGigs] = useState(() => window.CGM_STORAGE.getGigs());
  const [bookings, setBookings] = useState(() => window.CGM_STORAGE.getBookings());

  // Navigation & Filter States
  const [currentTab, setCurrentTab] = useState('browse'); // 'browse' | 'post' | 'dashboard' | 'my_bookings'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals & Drawers
  const [bookingTargetGig, setBookingTargetGig] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [editingGig, setEditingGig] = useState(null);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Form States
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', message: '' });
  const [postGigForm, setPostGigForm] = useState({
    title: '',
    category: window.CGM_STORAGE.CATEGORIES[0],
    rate: '',
    description: ''
  });
  const [newUserData, setNewUserData] = useState({ name: '', tagline: '', email: '' });

  // Sync to LocalStorage
  useEffect(() => {
    window.CGM_STORAGE.setUsers(users);
  }, [users]);

  useEffect(() => {
    window.CGM_STORAGE.setGigs(gigs);
  }, [gigs]);

  useEffect(() => {
    window.CGM_STORAGE.setBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    window.CGM_STORAGE.setActiveUserId(activeUserId);
  }, [activeUserId]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Active User computation
  const activeUser = useMemo(() => {
    return users.find(u => u.id === activeUserId) || users[0];
  }, [users, activeUserId]);

  // Initialize booking form when modal opens
  useEffect(() => {
    if (bookingTargetGig && activeUser) {
      setBookingForm({
        name: activeUser.name,
        email: activeUser.email,
        message: ''
      });
    }
  }, [bookingTargetGig, activeUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const getUser = (id) => users.find(u => u.id === id) || { name: 'Unknown Creator', tagline: '', avatar: '' };

  // Handlers
  const handleSwitchUser = (userId) => {
    setActiveUserId(userId);
    const target = users.find(u => u.id === userId);
    showToast(`Switched active persona to ${target.name}`, 'info');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim()) return;

    const newUser = {
      id: `usr_${Date.now()}`,
      name: newUserData.name.trim(),
      role: 'both',
      tagline: newUserData.tagline.trim() || 'Independent Creator & Client',
      email: newUserData.email.trim() || `${newUserData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
    };

    setUsers(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
    setShowNewUserModal(false);
    setNewUserData({ name: '', tagline: '', email: '' });
    showToast(`Welcome, ${newUser.name}! Persona created and active.`);
  };

  // Post a Gig
  const handlePostGigSubmit = (e) => {
    e.preventDefault();
    if (!postGigForm.title.trim() || !postGigForm.rate || !postGigForm.description.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const newGig = {
      id: `gig_${Date.now()}`,
      creator_id: activeUser.id,
      title: postGigForm.title.trim(),
      category: postGigForm.category,
      rate: Number(postGigForm.rate),
      description: postGigForm.description.trim(),
      status: 'active',
      created_at: new Date().toISOString()
    };

    setGigs(prev => [newGig, ...prev]);
    setPostGigForm({
      title: '',
      category: window.CGM_STORAGE.CATEGORIES[0],
      rate: '',
      description: ''
    });
    setCurrentTab('browse');
    showToast(`Gig "${newGig.title.substring(0, 30)}..." published! Visible in search immediately.`);
  };

  const fillSampleGigPreset = () => {
    setPostGigForm({
      title: 'Short-Form TikTok/Reels Video Retention Editing & Sound FX',
      category: 'Video Editing',
      rate: '60',
      description: 'Full vertical edit with dynamic Alex Hormozi-style subtitle animations, B-roll overlays, trending SFX, and pacing optimized for 70%+ retention rate.'
    });
    showToast('Sample gig details auto-filled!', 'info');
  };

  // Edit / Delete Gig
  const handleUpdateGig = (e) => {
    e.preventDefault();
    if (!editingGig) return;

    setGigs(prev => prev.map(g => g.id === editingGig.id ? { ...editingGig, rate: Number(editingGig.rate) } : g));
    setEditingGig(null);
    showToast('Gig listing updated successfully.');
  };

  const handleDeleteGig = (gigId) => {
    if (confirm('Are you sure you want to remove this gig listing?')) {
      setGigs(prev => prev.filter(g => g.id !== gigId));
      showToast('Gig listing deleted.');
    }
  };

  // Book a Gig
  const handleBookGigSubmit = (e) => {
    e.preventDefault();
    if (!bookingTargetGig) return;

    const newBooking = {
      id: `bk_${Math.floor(1000 + Math.random() * 9000)}`,
      gig_id: bookingTargetGig.id,
      client_id: activeUser.id,
      client_name: bookingForm.name.trim() || activeUser.name,
      client_email: bookingForm.email.trim() || activeUser.email,
      message: bookingForm.message.trim(),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    const bookedGig = bookingTargetGig;
    setBookingTargetGig(null);
    setBookingConfirmation({ booking: newBooking, gig: bookedGig });
    showToast(`Booking ${newBooking.id} created with Pending status!`);
  };

  // Creator Dashboard Accept / Decline Actions
  const handleBookingAction = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId && b.status === 'pending') {
        return { ...b, status: newStatus, resolved_at: new Date().toISOString() };
      }
      return b;
    }));

    if (newStatus === 'accepted') {
      showToast(`Booking ${bookingId} Accepted! Client has been updated.`);
    } else {
      showToast(`Booking ${bookingId} Declined. Record preserved per DP1.`, 'info');
    }
  };

  // Reset to default sample state
  const handleResetData = () => {
    if (confirm('Reset all gigs, bookings, and users back to clean demo seed state?')) {
      window.CGM_STORAGE.resetToDefault();
      setUsers(window.CGM_STORAGE.getUsers());
      setGigs(window.CGM_STORAGE.getGigs());
      setBookings(window.CGM_STORAGE.getBookings());
      setActiveUserId(window.CGM_STORAGE.getActiveUserId());
      showToast('Marketplace demo data reset to pristine state.', 'info');
    }
  };

  // Filtered & Sorted Gigs (DP3: Newest first)
  const filteredGigs = useMemo(() => {
    return gigs
      .filter(g => g.status === 'active')
      .filter(g => {
        const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
        const matchesSearch = !searchQuery.trim() ||
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // DP3: Newest first
  }, [gigs, selectedCategory, searchQuery]);

  // Creator's incoming bookings
  const creatorBookings = useMemo(() => {
    const myGigIds = new Set(gigs.filter(g => g.creator_id === activeUser.id).map(g => g.id));
    return bookings
      .filter(b => myGigIds.has(b.gig_id))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookings, gigs, activeUser.id]);

  // Client's made bookings
  const clientBookings = useMemo(() => {
    return bookings
      .filter(b => b.client_id === activeUser.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookings, activeUser.id]);

  // Creator's own gigs
  const creatorGigs = useMemo(() => {
    return gigs
      .filter(g => g.creator_id === activeUser.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [gigs, activeUser.id]);

  const pendingCreatorBookingsCount = useMemo(() => {
    return creatorBookings.filter(b => b.status === 'pending').length;
  }, [creatorBookings]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all transform translate-y-0 text-sm font-medium border ${
          toast.type === 'error'
            ? 'bg-rose-900 text-rose-100 border-rose-700'
            : toast.type === 'info'
            ? 'bg-slate-900 text-sky-200 border-slate-700'
            : 'bg-slate-900 text-emerald-300 border-emerald-500/40'
        }`}>
          <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner / Hackathon Quick Bar */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase">Hackathon MVP</span>
            <span>Creator Gig Marketplace • Doc Owner: Sarthak</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJudgeModal(true)}
              className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md font-semibold hover:bg-amber-300 transition-colors shadow-sm"
            >
              <span>🏆 Hackathon Decision Points (20 pts)</span>
            </button>
            <button
              onClick={handleResetData}
              className="text-white/80 hover:text-white underline text-[11px] transition-colors"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('browse')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-100">
                ⚡
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                  SparkGig
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Creator Economy
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentTab('browse')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'browse'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🔍 Browse Gigs
              </button>

              <button
                onClick={() => setCurrentTab('post')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'post'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                ➕ Post a Gig
              </button>

              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                📊 Creator Dashboard
                {pendingCreatorBookingsCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-amber-500 rounded-full animate-pulse">
                    {pendingCreatorBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('my_bookings')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'my_bookings'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                📋 My Bookings
                {clientBookings.length > 0 && (
                  <span className="ml-1.5 text-xs text-slate-500 font-normal">
                    ({clientBookings.length})
                  </span>
                )}
              </button>
            </nav>

            {/* User Persona Switcher ("Who are you?") */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-3 py-1.5 rounded-xl cursor-pointer transition-all">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-400"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                      {activeUser.name}
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-normal">
                        Active
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{activeUser.tagline}</p>
                  </div>
                  <span className="text-xs text-slate-400">▼</span>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 hidden group-hover:block z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Demo Persona</p>
                    <p className="text-xs text-slate-500">Test client booking & creator acceptance seamlessly</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-indigo-50/70 transition-colors ${
                          u.id === activeUser.id ? 'bg-indigo-50/90 font-bold text-indigo-900' : 'text-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1 truncate">
                          <p className="text-xs font-semibold truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{u.tagline}</p>
                        </div>
                        {u.id === activeUser.id && (
                          <span className="text-indigo-600 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowNewUserModal(true)}
                      className="w-full text-center text-xs font-semibold py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      + Add Custom User Persona
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* VIEW 1: BROWSE & SEARCH (CLIENT) */}
        {currentTab === 'browse' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                  <span>🚀 Two-Sided Marketplace MVP</span>
                  <span>•</span>
                  <span>Ranked Newest First (DP3)</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Book Young Creators with Verified Skills in Under 60s
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Discover talented video editors, brand designers, tutors, and writers ready to ship your vision. Transparent rates, zero booking friction, and live status tracking.
                </p>

                {/* Live Search Input */}
                <div className="pt-2 flex items-center">
                  <div className="relative w-full max-w-lg">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none text-base">
                      🔍
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search gigs by title or description (e.g. video, logo, python, copy)..."
                      className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 text-sm backdrop-blur-md transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-white text-xs"
                      >
                        ✕ Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute right-10 bottom-0 opacity-10 text-9xl select-none font-black text-white pointer-events-none">
                GIGS
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Filter by Skill Category
                </span>
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-slate-900">{filteredGigs.length}</strong> active gigs
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === 'All'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ✨ All Categories
                </button>
                {window.CGM_STORAGE.CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gigs Grid */}
            {filteredGigs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <div className="text-5xl">🔍</div>
                <h3 className="text-lg font-bold text-slate-800">No active gigs match your criteria</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing your search query or selecting a different category to view available services.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setCurrentTab('post')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Post a Gig in this Category
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGigs.map(gig => {
                  const creator = getUser(gig.creator_id);
                  const isOwnGig = gig.creator_id === activeUser.id;

                  return (
                    <div
                      key={gig.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-indigo-200"
                    >
                      <div className="p-6 space-y-4">
                        {/* Top Category Tag + Rate */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                            {gig.category}
                          </span>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-slate-900">${gig.rate}</span>
                            <span className="text-xs text-slate-500 font-medium ml-1">/ service</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {gig.title}
                        </h3>

                        {/* Description Snippet */}
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {gig.description}
                        </p>
                      </div>

                      {/* Creator Row & Action CTA */}
                      <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 mt-auto">
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 leading-tight">{creator.name}</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-[120px]">{creator.tagline}</p>
                            </div>
                          </div>

                          {isOwnGig ? (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold">
                              Your Gig
                            </span>
                          ) : (
                            <button
                              onClick={() => setBookingTargetGig(gig)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all"
                            >
                              Book Gig →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: POST A GIG (CREATOR) */}
        {currentTab === 'post' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Creator Fast-Publish</span>
                  <h2 className="text-2xl font-black text-slate-900">Post a Gig in under 60 Seconds</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Listings are marked <strong>Active</strong> immediately upon submission and show up at the top of Browse (DP3).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillSampleGigPreset}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors shrink-0"
                >
                  ⚡ Auto-Fill Preset
                </button>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex items-center gap-3">
                <img src={activeUser.avatar} alt={activeUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-300" />
                <div className="text-xs text-indigo-900">
                  Posting as <strong>{activeUser.name}</strong> ({activeUser.tagline}).
                  <span className="block text-indigo-700/80 text-[11px]">You can manage, edit, or delete this gig anytime from your dashboard.</span>
                </div>
              </div>

              <form onSubmit={handlePostGigSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gig Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={postGigForm.title}
                    onChange={(e) => setPostGigForm({ ...postGigForm, title: e.target.value })}
                    placeholder="e.g. YouTube Video Editing with Captions & Sound Effects"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Category (Fixed List) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={postGigForm.category}
                      onChange={(e) => setPostGigForm({ ...postGigForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-white"
                    >
                      {window.CGM_STORAGE.CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rate */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Rate ($ USD) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">$</span>
                      <input
                        type="number"
                        min="5"
                        max="10000"
                        required
                        value={postGigForm.rate}
                        onChange={(e) => setPostGigForm({ ...postGigForm, rate: e.target.value })}
                        placeholder="75"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Description & Deliverables <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={postGigForm.description}
                    onChange={(e) => setPostGigForm({ ...postGigForm, description: e.target.value })}
                    placeholder="Describe what you will provide, your turnaround timeline, and requirements for the client..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('browse')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                  >
                    Publish Gig Now →
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* VIEW 3: CREATOR DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Dashboard Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Creator Center</span>
                <h2 className="text-2xl font-black text-slate-900">Incoming Bookings & Gig Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged in as <strong>{activeUser.name}</strong>. Accept or decline booking inquiries in real time.
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('post')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                + Post Another Gig
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Your Active Gigs</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{creatorGigs.length}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Inquiries
                </span>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCreatorBookingsCount}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-emerald-600">Accepted Bookings</span>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {creatorBookings.filter(b => b.status === 'accepted').length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Requests Received</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{creatorBookings.length}</p>
              </div>
            </div>

            {/* SECTION: Incoming Bookings Across All Gigs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Incoming Booking Requests</h3>
                  <p className="text-xs text-slate-500">
                    Sorted newest first. Accept or decline pending client requests.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {creatorBookings.length} total
                </span>
              </div>

              {creatorBookings.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="text-4xl">📬</div>
                  <h4 className="text-sm font-bold text-slate-700">No bookings received yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When clients discover your gigs on Browse & Search and submit a booking request, they will show up here instantly.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {creatorBookings.map(bk => {
                    const gig = gigs.find(g => g.id === bk.gig_id) || { title: 'Unknown Gig', category: 'N/A', rate: 0 };
                    const isPending = bk.status === 'pending';

                    return (
                      <div key={bk.id} className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        
                        {/* Booking Details */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              {bk.id}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {gig.title}
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">
                              • {new Date(bk.created_at).toLocaleDateString()} {new Date(bk.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                            <span className="font-semibold text-slate-800">
                              Client: {bk.client_name}
                            </span>
                            {bk.client_email && (
                              <span className="text-slate-400">({bk.client_email})</span>
                            )}
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold text-slate-700">Value: ${gig.rate}</span>
                          </div>

                          {bk.message ? (
                            <div className="bg-slate-100/80 rounded-xl p-2.5 text-xs text-slate-700 italic border border-slate-200/60">
                              "{bk.message}"
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No message provided.</p>
                          )}
                        </div>

                        {/* Status & Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          {isPending ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleBookingAction(bk.id, 'accepted')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                              >
                                <span>✓ Accept</span>
                              </button>
                              <button
                                onClick={() => handleBookingAction(bk.id, 'declined')}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95 text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <span>✕ Decline</span>
                              </button>
                            </div>
                          ) : bk.status === 'accepted' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              ✓ Accepted
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                              ✕ Declined
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION: My Gigs Management */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Your Listed Gigs ({creatorGigs.length})</h3>
                  <p className="text-xs text-slate-500">Gigs you have posted that appear in public Browse & Search.</p>
                </div>
              </div>

              {creatorGigs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  You haven't posted any gigs yet. Click "Post Another Gig" above to offer a service!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creatorGigs.map(g => (
                    <div key={g.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {g.category}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900">${g.rate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1">{g.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{g.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingGig(g)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGig(g.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-rose-200 hover:bg-rose-50 text-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 4: MY BOOKINGS (CLIENT) */}
        {currentTab === 'my_bookings' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Client Center</span>
                <h2 className="text-2xl font-black text-slate-900">My Bookings & Request Status</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged in as <strong>{activeUser.name}</strong>. Track real-time status of services you have booked.
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('browse')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                🔍 Browse More Gigs
              </button>
            </div>

            {/* Decision Point 1 Banner Callout */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="text-xl">💡</div>
              <div className="text-xs text-indigo-900 leading-relaxed">
                <strong>Decision Point 1 (DP1) in Action:</strong> When a booking is declined, it remains permanently visible in your records as <strong>Declined</strong>. You can immediately re-book the same gig or explore other creators with zero cooldown or restriction.
              </div>
            </div>

            {/* Bookings List */}
            {clientBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <div className="text-4xl">📑</div>
                <h3 className="text-base font-bold text-slate-800">You haven't booked any creator gigs yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Find a service you need on Browse & Search, click "Book Gig", and your request will be tracked here.
                </p>
                <button
                  onClick={() => setCurrentTab('browse')}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  Explore Active Gigs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {clientBookings.map(bk => {
                  const gig = gigs.find(g => g.id === bk.gig_id) || { title: 'Unknown Gig', category: 'N/A', rate: 0, creator_id: null };
                  const creator = getUser(gig.creator_id);

                  return (
                    <div
                      key={bk.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-indigo-100 transition-all"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                            {bk.id}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {gig.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 truncate">
                            {gig.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium">
                            <img src={creator.avatar} alt={creator.name} className="w-5 h-5 rounded-full object-cover" />
                            <span>Creator: <strong>{creator.name}</strong></span>
                          </div>
                          <span>•</span>
                          <span className="font-semibold text-slate-900">${gig.rate}</span>
                          <span>•</span>
                          <span className="text-slate-400">
                            Requested {new Date(bk.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {bk.message && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                            Your message: "{bk.message}"
                          </p>
                        )}
                      </div>

                      {/* Live Status Pill & Action */}
                      <div className="flex flex-col items-end gap-2 shrink-0 self-end md:self-center">
                        {bk.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                              Pending Creator Review
                            </span>
                          </div>
                        )}

                        {bk.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Booking Accepted!
                          </span>
                        )}

                        {bk.status === 'declined' && (
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              ✕ Request Declined
                            </span>
                            {/* DP1 action: immediate re-book capability */}
                            <button
                              onClick={() => {
                                const target = gigs.find(g => g.id === bk.gig_id);
                                if (target) setBookingTargetGig(target);
                                else setCurrentTab('browse');
                              }}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
                            >
                              Re-book this Gig →
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </main>

      {/* MODAL: Book a Gig Modal */}
      {bookingTargetGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Checkout / Request</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Book Creator Service</h3>
              </div>
              <button
                onClick={() => setBookingTargetGig(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Gig preview inside modal */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 font-bold rounded bg-indigo-100 text-indigo-700">
                  {bookingTargetGig.category}
                </span>
                <span className="text-base font-black text-slate-900">${bookingTargetGig.rate}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{bookingTargetGig.title}</h4>
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                <img
                  src={getUser(bookingTargetGig.creator_id).avatar}
                  alt="Creator"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>Creator: <strong>{getUser(bookingTargetGig.creator_id).name}</strong></span>
              </div>
            </div>

            <form onSubmit={handleBookGigSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact / Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Optional Message / Project Scope
                </label>
                <textarea
                  rows="3"
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  placeholder="Describe your timeline, footage length, or specific design preferences..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingTargetGig(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                >
                  Confirm & Submit Request (Pending) →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Booking Confirmation (Requirement 4.3) */}
      {bookingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Booking Confirmed</span>
              <h3 className="text-2xl font-black text-slate-900">Request Sent to Creator!</h3>
              <p className="text-xs text-slate-500">
                Your booking has been created and logged in the system.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Booking ID:</span>
                <span className="font-mono font-bold text-indigo-700">{bookingConfirmation.booking.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Gig:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{bookingConfirmation.gig.title}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Rate:</span>
                <span className="font-extrabold text-slate-900">${bookingConfirmation.gig.rate}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => {
                  setBookingConfirmation(null);
                  setCurrentTab('my_bookings');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100"
              >
                View in My Bookings →
              </button>
              <button
                onClick={() => setBookingConfirmation(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Gig Modal */}
      {editingGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Gig Listing</h3>
              <button onClick={() => setEditingGig(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleUpdateGig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gig Title</label>
                <input
                  type="text"
                  required
                  value={editingGig.title}
                  onChange={(e) => setEditingGig({ ...editingGig, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingGig.category}
                    onChange={(e) => setEditingGig({ ...editingGig, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    {window.CGM_STORAGE.CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rate ($)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={editingGig.rate}
                    onChange={(e) => setEditingGig({ ...editingGig, rate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingGig.description}
                  onChange={(e) => setEditingGig({ ...editingGig, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGig(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Hackathon Decision Points & Judging Showcase (20 PTS) */}
      {showJudgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wide">
                  🏆 Judging Rubric Section • 20 Points
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Decision Points & Product Defenses
                </h3>
              </div>
              <button
                onClick={() => setShowJudgeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-left">
              
              {/* DP1 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">1</span>
                  <h4 className="font-extrabold text-sm text-slate-900">DP1 — Rejection Resolution</h4>
                </div>
                <p className="text-xs text-slate-700 font-semibold pl-8">
                  <strong>Decision:</strong> Declined bookings remain visible as a preserved record in "My Bookings". The client can immediately re-book the same gig or any other gig with no restriction.
                </p>
                <div className="pl-8 text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80">
                  <strong>Why:</strong> A decline reflects the creator's bandwidth for that specific project or timing — not a character judgment on the client. Blocking or rate-limiting adds friction without benefit and risks punishing legitimate attempts.
                </div>
              </div>

              {/* DP2 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">2</span>
                  <h4 className="font-extrabold text-sm text-slate-900">DP2 — Double Booking Resolution</h4>
                </div>
                <p className="text-xs text-slate-700 font-semibold pl-8">
                  <strong>Decision:</strong> Yes — a gig can receive multiple simultaneous Pending bookings. No auto-locking.
                </p>
                <div className="pl-8 text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80">
                  <strong>Why:</strong> A gig is an ongoing <em>service listing</em>, not a physical calendar slot. Auto-locking upon a single pending request destroys marketplace liquidity; one slow client could freeze out every other lead. The creator's dashboard is where triage happens.
                </div>
              </div>

              {/* DP3 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">3</span>
                  <h4 className="font-extrabold text-sm text-slate-900">DP3 — Discovery Ranking</h4>
                </div>
                <p className="text-xs text-slate-700 font-semibold pl-8">
                  <strong>Decision:</strong> Rank listings by <strong>Newest First</strong>.
                </p>
                <div className="pl-8 text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80">
                  <strong>Why:</strong> The most defensible rule under hackathon constraints — "cheapest first" causes a quality race-to-the-bottom, and rotation adds unnecessary opacity. Newest-first rewards active creators who keep offerings fresh.
                </div>
              </div>

              {/* Key Assumptions */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Architectural Assumptions Log</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Unified User Model:</strong> Single User entity allowing any person to post gigs as a creator and book other gigs as a client.</li>
                  <li><strong>Persona Quick Switcher:</strong> Replaces heavy auth flows to enable instant 2-second demos between client and creator viewpoints.</li>
                  <li><strong>Instant LocalStorage Persistence:</strong> Zero database setup needed, fully stateful across page reloads.</li>
                </ul>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowJudgeModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Close & Return to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Custom User Creator */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Add Demo Persona</h3>
              <button onClick={() => setShowNewUserModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Role</label>
                <input
                  type="text"
                  value={newUserData.tagline}
                  onChange={(e) => setNewUserData({ ...newUserData, tagline: e.target.value })}
                  placeholder="e.g. Podcast Host & Client"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="maya@creatorhub.co"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Save & Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">SparkGig</span>
            <span>— Creator Gig Marketplace (Hackathon MVP)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setShowJudgeModal(true)} className="hover:text-indigo-600 font-semibold">
              Decision Points (DP1–DP3)
            </button>
            <span>•</span>
            <span>Doc Owner: Sarthak</span>
            <span>•</span>
            <span>Category: Creator Economy</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Render React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

