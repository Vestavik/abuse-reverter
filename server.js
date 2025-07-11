<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Roblox Rank Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center p-6">

  <h1 class="text-3xl font-bold mb-6">Roblox Rank Manager</h1>

  <!-- Mode tabs -->
  <div class="flex space-x-6 mb-8 text-lg font-semibold">
    <button id="tab-revert" class="border-b-4 border-blue-500 pb-2">Revert Abuse</button>
    <button id="tab-manual" class="border-b-4 border-transparent pb-2 hover:border-gray-400">Manual Rank Change</button>
  </div>

  <!-- Cookie input -->
  <div class="w-full max-w-lg mb-6">
    <label for="cookieInput" class="block mb-1 font-medium">🔑 Enter .ROBLOSECURITY Cookie</label>
    <input id="cookieInput" type="password" placeholder="Your .ROBLOSECURITY cookie here" 
      class="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
  </div>

  <!-- Group selector (populated after cookie) -->
  <div class="w-full max-w-lg mb-6" id="groupContainer" style="display:none;">
    <label for="groupSelect" class="block mb-1 font-medium">👥 Select Group</label>
    <select id="groupSelect" class="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="" disabled selected>Loading groups...</option>
    </select>
  </div>

  <!-- Revert Abuse Mode -->
  <section id="revertSection" class="w-full max-w-lg space-y-4">

    <!-- Fetch ranks button & selects -->
    <div>
      <button id="fetchRanksBtn" class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold rounded-xl shadow-md hover:opacity-90 transition">
        📥 Fetch Group Ranks
      </button>
    </div>

    <div class="flex space-x-4">
      <select id="currentRankSelect" class="flex-1 p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" disabled>
        <option>Select current rank</option>
      </select>
      <select id="newRankSelect" class="flex-1 p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" disabled>
        <option>Select new rank</option>
      </select>
    </div>

    <button id="startRevertBtn" class="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 font-semibold rounded-xl shadow-md hover:opacity-90 transition" disabled>
      🚀 Start Revert
    </button>

    <pre id="revertLog" class="mt-4 bg-gray-800 p-4 rounded-xl h-32 overflow-auto text-sm"></pre>
  </section>

  <!-- Manual Rank Change Mode -->
  <section id="manualSection" class="w-full max-w-lg space-y-4 hidden">

    <div>
      <button id="fetchManualRanksBtn" class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold rounded-xl shadow-md hover:opacity-90 transition">
        📥 Fetch Group Ranks
      </button>
    </div>

    <div>
      <label for="manualRankSelect" class="block mb-1 font-medium">Select Rank to List Users</label>
      <select id="manualRankSelect" class="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" disabled>
        <option>Select rank</option>
      </select>
    </div>

    <div>
      <input type="text" id="userSearchInput" placeholder="Search user by username or ID" 
        class="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled />
    </div>

    <div id="userList" class="max-h-40 overflow-auto rounded-xl border border-gray-700 bg-gray-800 p-2 text-sm"></div>

    <div>
      <label for="manualNewRankSelect" class="block mb-1 font-medium">↩️ New Rank</label>
      <select id="manualNewRankSelect" class="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" disabled>
        <option>Select new rank</option>
      </select>
    </div>

    <button id="changeUserRankBtn" class="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 font-semibold rounded-xl shadow-md hover:opacity-90 transition" disabled>
      🚀 Change Rank
    </button>

    <pre id="manualLog" class="mt-4 bg-gray-800 p-4 rounded-xl h-32 overflow-auto text-sm"></pre>

  </section>

  <script>
    // DOM refs
    const cookieInput = document.getElementById('cookieInput');
    const groupContainer = document.getElementById('groupContainer');
    const groupSelect = document.getElementById('groupSelect');

    // Revert mode refs
    const revertSection = document.getElementById('revertSection');
    const fetchRanksBtn = document.getElementById('fetchRanksBtn');
    const currentRankSelect = document.getElementById('currentRankSelect');
    const newRankSelect = document.getElementById('newRankSelect');
    const startRevertBtn = document.getElementById('startRevertBtn');
    const revertLog = document.getElementById('revertLog');

    // Manual mode refs
    const manualSection = document.getElementById('manualSection');
    const fetchManualRanksBtn = document.getElementById('fetchManualRanksBtn');
    const manualRankSelect = document.getElementById('manualRankSelect');
    const userSearchInput = document.getElementById('userSearchInput');
    const userList = document.getElementById('userList');
    const manualNewRankSelect = document.getElementById('manualNewRankSelect');
    const changeUserRankBtn = document.getElementById('changeUserRankBtn');
    const manualLog = document.getElementById('manualLog');

    // Tabs
    const tabRevert = document.getElementById('tab-revert');
    const tabManual = document.getElementById('tab-manual');

    let groups = [];
    let ranks = [];
    let manualUsers = [];
    let filteredUsers = [];
    let selectedManualUser = null;

    // Switch tabs
    tabRevert.onclick = () => {
      tabRevert.classList.add('border-blue-500');
      tabManual.classList.remove('border-blue-500');
      revertSection.classList.remove('hidden');
      manualSection.classList.add('hidden');
    };
    tabManual.onclick = () => {
      tabManual.classList.add('border-blue-500');
      tabRevert.classList.remove('border-blue-500');
      manualSection.classList.remove('hidden');
      revertSection.classList.add('hidden');
    };

    // Fetch groups user can manage - requires /groups endpoint
    async function fetchGroups() {
      const cookie = cookieInput.value.trim();
      if (!cookie) return;

      groupContainer.style.display = 'block';
      groupSelect.innerHTML = '<option disabled selected>Loading groups...</option>';

      try {
        const res = await fetch('/groups', {
          headers: { 'X-Cookie': cookie }
        });
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          groupSelect.innerHTML = '<option disabled>No manageable groups found</option>';
          return;
        }

        groups = data;
        groupSelect.innerHTML = '<option disabled selected>Select a group</option>';
        groups.forEach(g => {
          const opt = document.createElement('option');
          opt.value = g.id;
          opt.textContent = `${g.name} (ID: ${g.id})`;
          groupSelect.appendChild(opt);
        });
      } catch (err) {
        groupSelect.innerHTML = '<option disabled>Error loading groups</option>';
      }
    }

    cookieInput.addEventListener('change', fetchGroups);
    cookieInput.addEventListener('paste', () => setTimeout(fetchGroups, 100)); // fetch after paste

    // Fetch ranks (revert mode)
    fetchRanksBtn.onclick = async () => {
      const groupId = groupSelect.value;
      if (!groupId) {
        revertLog.textContent = '⚠️ Please select a group first.';
        return;
      }
      const cookie = cookieInput.value.trim();
      if (!cookie) {
        revertLog.textContent = '⚠️ Enter your cookie first.';
        return;
      }

      revertLog.textContent = '⏳ Fetching ranks...';
      currentRankSelect.innerHTML = '';
      newRankSelect.innerHTML = '';
      currentRankSelect.disabled = true;
      newRankSelect.disabled = true;
      startRevertBtn.disabled = true;

      try {
        const res = await fetch(`/roles?groupId=${groupId}`);
        const ranksData = await res.json();

        if (!Array.isArray(ranksData) || ranksData.length === 0) {
          revertLog.textContent = '❌ No ranks found.';
          return;
        }

        ranks = ranksData;

        const defaultOption1 = document.createElement('option');
        defaultOption1.textContent = 'Select current rank';
        defaultOption1.disabled = true;
        defaultOption1.selected = true;
        currentRankSelect.appendChild(defaultOption1);

        const defaultOption2 = document.createElement('option');
        defaultOption2.textContent = 'Select new rank';
        defaultOption2.disabled = true;
        defaultOption2.selected = true;
        newRankSelect.appendChild(defaultOption2);

        for (const r of ranks) {
          const opt1 = document.createElement('option');
          opt1.value = r.rank;
          opt1.textContent = `(${r.rank}) ${r.name}`;
          currentRankSelect.appendChild(opt1);

          const opt2 = opt1.cloneNode(true);
          newRankSelect.appendChild(opt2);
        }

        currentRankSelect.disabled = false;
        newRankSelect.disabled = false;
        startRevertBtn.disabled = false;
        revertLog.textContent = '✅ Ranks loaded! Select ranks and start revert.';
      } catch {
        revertLog.textContent = '❌ Failed to load ranks.';
      }
    };

    // Start revert
    startRevertBtn.onclick = async () => {
      const cookie = cookieInput.value.trim();
      const groupId = parseInt(groupSelect.value);
      const currentRankId = parseInt(currentRankSelect.value);
      const newRankId = parseInt(newRankSelect.value);

      if (!cookie || !groupId || !currentRankId || !newRankId) {
        revertLog.textContent = '⚠️ Fill out all fields.';
        return;
      }

      startRevertBtn.disabled = true;
      revertLog.textContent = '⏳ Reverting ranks...';

      try {
        const res = await fetch('/revert', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ cookie, groupId, currentRankId, newRankId })
        });
        const data = await res.json();

        if (data.success) {
          revertLog.textContent = `✅ Reverted ${data.count} users successfully!\n\n${data.logs.join('\n')}`;
        } else {
          revertLog.textContent = `❌ Error: ${data.error}`;
        }
      } catch (e) {
        revertLog.textContent = `💥 Failed: ${e.message}`;
      }
      startRevertBtn.disabled = false;
    };

    // Manual mode: fetch ranks for listing users
    fetchManualRanksBtn.onclick = async () => {
      const groupId = groupSelect.value;
      if (!groupId) {
        manualLog.textContent = '⚠️ Select a group first.';
        return;
      }

      manualRankSelect.innerHTML = '';
      manualNewRankSelect.innerHTML = '';
      userSearchInput.value = '';
      userList.innerHTML = '';
      manualLog.textContent = '⏳ Fetching ranks...';

      try {
        const res = await fetch(`/roles?groupId=${groupId}`);
        const ranksData = await res.json();

        if (!Array.isArray(ranksData) || ranksData.length === 0) {
          manualLog.textContent = '❌ No ranks found.';
          return;
        }

        ranks = ranksData;

        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select rank';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        manualRankSelect.appendChild(defaultOption);

        const newRankDefault = document.createElement('option');
        newRankDefault.textContent = 'Select new rank';
        newRankDefault.disabled = true;
        newRankDefault.selected = true;
        manualNewRankSelect.appendChild(newRankDefault);

        for (const r of ranks) {
          const opt = document.createElement('option');
          opt.value = r.rank;
          opt.textContent = `(${r.rank}) ${r.name}`;
          manualRankSelect.appendChild(opt);

          const optNew = opt.cloneNode(true);
          manualNewRankSelect.appendChild(optNew);
        }

        manualRankSelect.disabled = false;
        manualNewRankSelect.disabled = false;
        userSearchInput.disabled = true; // until users fetched
        manualLog.textContent = '✅ Ranks loaded! Select a rank to fetch users.';
      } catch {
        manualLog.textContent = '❌ Failed to load ranks.';
      }
    };

    // When manual rank selected - fetch users with that rank
    manualRankSelect.onchange = async () => {
      const groupId = groupSelect.value;
      const rankId = manualRankSelect.value;
      if (!groupId || !rankId) return;

      manualLog.textContent = '⏳ Fetching users...';
      userList.innerHTML = '';
      userSearchInput.value = '';
      userSearchInput.disabled = true;
      selectedManualUser = null;
      changeUserRankBtn.disabled = true;

      try {
        const res = await fetch(`/users?groupId=${groupId}&rankId=${rankId}`);
        const users = await res.json();
        manualUsers = users;
        filteredUsers = [...manualUsers];
        manualLog.textContent = `✅ Found ${users.length} users with rank ${rankId}`;
        userSearchInput.disabled = false;

        renderUserList(filteredUsers);
      } catch {
        manualLog.textContent = '❌ Failed to fetch users.';
      }
    };

    // Search/filter users list
    userSearchInput.oninput = () => {
      const term = userSearchInput.value.trim().toLowerCase();
      filteredUsers = manualUsers.filter(u =>
        u.username.toLowerCase().includes(term) || u.userId.toString().includes(term)
      );
      renderUserList(filteredUsers);
    };

    // Render user list for manual mode
    function renderUserList(users) {
      userList.innerHTML = '';
      if (users.length === 0) {
        userList.textContent = 'No users found.';
        return;
      }
      users.forEach(user => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer p-1 rounded hover:bg-blue-700';
        el.textContent = `${user.username} (ID: ${user.userId})`;
        el.onclick = () => {
          selectedManualUser = user;
          [...userList.children].forEach(c => c.classList.remove('bg-blue-700'));
          el.classList.add('bg-blue-700');
        };
        userList.appendChild(el);
      });
    }

    // Change selected user's rank manually
    changeUserRankBtn.onclick = async () => {
      if (!selectedManualUser) {
        manualLog.textContent = '⚠️ Select a user first.';
        return;
      }
      const cookie = cookieInput.value.trim();
      const groupId = parseInt(groupSelect.value);
      const newRank = parseInt(manualNewRankSelect.value);

      if (!cookie || !groupId || !newRank) {
        manualLog.textContent = '⚠️ Fill out all fields.';
        return;
      }

      changeUserRankBtn.disabled = true;
      manualLog.textContent = `⏳ Changing rank for ${selectedManualUser.username}...`;

      try {
        const res = await fetch('/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cookie,
            groupId,
            userId: selectedManualUser.userId,
            newRank
          }),
        });
        const data = await res.json();

        if (data.success) {
          manualLog.textContent = `✅ Changed rank for ${selectedManualUser.username} successfully!`;
        } else {
          manualLog.textContent = `❌ Error: ${data.error}`;
        }
      } catch (err) {
        manualLog.textContent = `💥 Failed: ${err.message}`;
      }
      changeUserRankBtn.disabled = false;
    };

    // Enable change rank button only if user and new rank selected
    manualNewRankSelect.onchange = () => {
      changeUserRankBtn.disabled = !selectedManualUser || !manualNewRankSelect.value;
    };

    userList.addEventListener('click', () => {
      changeUserRankBtn.disabled = !selectedManualUser || !manualNewRankSelect.value;
    });

  </script>

</body>
</html>
