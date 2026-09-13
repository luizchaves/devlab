import { requireSession } from '../guards/require-session.js';
import { renderNavbar } from '../lib/navbar.js';
import { initTheme } from '../lib/theme.js';
import { onSessionEnd, signOut } from '../services/auth.js';
import { getProfile, removeAvatar, updateProfile, uploadAvatar } from '../services/profile.js';

// #region profile-page
initTheme();
renderNavbar({ userEmail: '', role: 'investor', activePath: '/profile' });

const session = await requireSession();

const form = document.querySelector('[data-profile-form]');
const fullNameInput = document.querySelector('#fullName');
const emailInput = document.querySelector('#email');
const createdAtInput = document.querySelector('#createdAt');
const avatarContainer = document.querySelector('[data-profile-avatar-container]');
const avatarInitial = document.querySelector('[data-profile-avatar-initial]');
const avatarImg = document.querySelector('[data-profile-avatar-img]');
const avatarInput = document.querySelector('[data-avatar-input]');
const avatarUploadBtn = document.querySelector('[data-avatar-upload-btn]');
const avatarRemoveBtn = document.querySelector('[data-avatar-remove-btn]');
const nameDisplay = document.querySelector('[data-profile-name-display]');
const emailDisplay = document.querySelector('[data-profile-email-display]');
const roleBadge = document.querySelector('[data-profile-role-badge]');
const toastEl = document.querySelector('[data-toast]');
const errorEl = document.querySelector('[data-error]');
const saveBtn = document.querySelector('[data-save-btn]');

let currentProfile = null;

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  if (errorEl) errorEl.hidden = true;
  setTimeout(() => {
    toastEl.hidden = true;
  }, 4000);
}

function showError(message) {
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.hidden = false;
  if (toastEl) toastEl.hidden = true;
}

function updateVisuals({ fullName, email, role, createdAt, avatarUrl }) {
  const cleanName = (fullName || '').trim();
  const initial = (cleanName || email || 'U').charAt(0).toUpperCase();
  const isAdmin = role === 'admin';

  if (avatarContainer) {
    avatarContainer.className = `h-20 w-20 rounded-2xl overflow-hidden shadow-md flex items-center justify-center ${
      isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
    } text-white font-extrabold text-3xl flex-shrink-0`;
  }

  if (avatarUrl) {
    if (avatarImg) {
      avatarImg.src = avatarUrl;
      avatarImg.classList.remove('hidden');
    }
    if (avatarInitial) {
      avatarInitial.classList.add('hidden');
    }
    if (avatarRemoveBtn) {
      avatarRemoveBtn.hidden = false;
    }
  } else {
    if (avatarImg) {
      avatarImg.removeAttribute('src');
      avatarImg.classList.add('hidden');
    }
    if (avatarInitial) {
      avatarInitial.textContent = initial;
      avatarInitial.classList.remove('hidden');
    }
    if (avatarRemoveBtn) {
      avatarRemoveBtn.hidden = true;
    }
  }

  if (nameDisplay) {
    nameDisplay.textContent = cleanName || 'Investidor';
  }

  if (emailDisplay) {
    emailDisplay.textContent = email || '';
  }

  if (roleBadge) {
    roleBadge.textContent = isAdmin ? 'Administrador' : 'Investidor';
    roleBadge.className = isAdmin
      ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
      : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
  }

  renderNavbar({
    userEmail: email,
    userName: cleanName,
    avatarUrl: avatarUrl || '',
    role: role || 'investor',
    activePath: '/profile',
  });
}

// Carrega os dados do perfil
const { data: profileData, error: loadError } = await getProfile();
if (loadError) {
  showError('Não foi possível carregar as informações do perfil.');
} else if (profileData) {
  currentProfile = profileData;
  if (fullNameInput) fullNameInput.value = profileData.fullName || '';
  if (emailInput) emailInput.value = profileData.email || '';
  if (createdAtInput && profileData.createdAt) {
    const date = new Date(profileData.createdAt);
    createdAtInput.value = Number.isNaN(date.getTime())
      ? profileData.createdAt
      : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
  }

  updateVisuals(profileData);
}

// Upload de Avatar via input file
avatarInput?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (errorEl) errorEl.hidden = true;

  if (avatarUploadBtn) {
    avatarUploadBtn.classList.add('opacity-70', 'pointer-events-none');
  }

  const { data, error } = await uploadAvatar({
    userId: session?.user?.id,
    file,
  });

  if (avatarUploadBtn) {
    avatarUploadBtn.classList.remove('opacity-70', 'pointer-events-none');
  }
  avatarInput.value = '';

  if (error) {
    showError(error.message || 'Erro ao enviar a foto de perfil. Tente novamente.');
    return;
  }

  if (currentProfile) {
    currentProfile.avatarUrl = data.publicUrl;
  }

  updateVisuals({
    fullName: fullNameInput?.value || currentProfile?.fullName || '',
    email: currentProfile?.email || session.user.email,
    role: currentProfile?.role || 'investor',
    createdAt: currentProfile?.createdAt,
    avatarUrl: data.publicUrl,
  });

  showToast('Foto de perfil atualizada com sucesso!');
});

// Remover Avatar
avatarRemoveBtn?.addEventListener('click', async () => {
  if (errorEl) errorEl.hidden = true;

  avatarRemoveBtn.disabled = true;
  avatarRemoveBtn.classList.add('opacity-70');

  const { error } = await removeAvatar({ userId: session?.user?.id });

  avatarRemoveBtn.disabled = false;
  avatarRemoveBtn.classList.remove('opacity-70');

  if (error) {
    showError(error.message || 'Erro ao remover a foto de perfil.');
    return;
  }

  if (currentProfile) {
    currentProfile.avatarUrl = null;
  }

  updateVisuals({
    fullName: fullNameInput?.value || currentProfile?.fullName || '',
    email: currentProfile?.email || session.user.email,
    role: currentProfile?.role || 'investor',
    createdAt: currentProfile?.createdAt,
    avatarUrl: null,
  });

  showToast('Foto de perfil removida com sucesso!');
});

// Submissão do formulário
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (errorEl) errorEl.hidden = true;

  const newFullName = fullNameInput?.value.trim() || '';
  if (!newFullName) {
    showError('O nome completo não pode ficar em branco.');
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.classList.add('opacity-70', 'cursor-not-allowed');
  }

  const { data, error } = await updateProfile({ fullName: newFullName });
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.classList.remove('opacity-70', 'cursor-not-allowed');
  }

  if (error) {
    showError(error.message || 'Erro ao atualizar o perfil. Tente novamente.');
    return;
  }

  if (currentProfile) {
    currentProfile.fullName = newFullName;
  }

  updateVisuals({
    fullName: newFullName,
    email: currentProfile?.email || session.user.email,
    role: currentProfile?.role || 'investor',
    createdAt: currentProfile?.createdAt,
    avatarUrl: currentProfile?.avatarUrl || null,
  });

  showToast('Perfil atualizado com sucesso!');
});

for (const btn of document.querySelectorAll('[data-sign-out], [data-sign-out-menu]')) {
  btn.addEventListener('click', async () => {
    await signOut();
    window.location.replace('/signin');
  });
}

onSessionEnd(() => window.location.replace('/signin'));
// #endregion
