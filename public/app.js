const PAYMENT_URL = 'https://payfast.greenn.com.br/8r8ve8e';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('leadForm');

    // ── WhatsApp mask ────────────────────────────────────────────
    const whatsInput = document.getElementById('f-whats');
    whatsInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10)      v = v.replace(/(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        else if (v.length > 6)  v = v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        else if (v.length > 2)  v = v.replace(/(\d{2})(\d{0,5}).*/,        '($1) $2');
        else if (v.length > 0)  v = v.replace(/(\d{0,2}).*/,               '($1');
        e.target.value = v;
    });

    // ── Modal open / close ───────────────────────────────────────
    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('f-name')?.focus(), 280);
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-cta]').forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // ── Inline field error helpers ───────────────────────────────
    function setError(fieldName, msg) {
        const wrap = form.querySelector(`[data-field="${fieldName}"]`);
        if (!wrap) return;
        wrap.classList.toggle('error', !!msg);
        let err = wrap.querySelector('.err-msg');
        if (msg) {
            if (!err) {
                err = document.createElement('div');
                err.className = 'err-msg';
                wrap.appendChild(err);
            }
            err.textContent = msg;
        } else if (err) {
            err.remove();
        }
    }

    // Limpa erro ao digitar
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const field = input.closest('[data-field]');
            if (field) {
                field.classList.remove('error');
                const err = field.querySelector('.err-msg');
                if (err) err.remove();
            }
        });
    });

    // ── Submit ───────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameVal  = document.getElementById('f-name').value.trim();
        const whatsVal = document.getElementById('f-whats').value.replace(/\D/g, '');
        const instaVal = document.getElementById('f-insta').value.trim().replace(/^@+/, '');

        // Validação — nome e telefone obrigatórios
        let valid = true;

        if (nameVal.length < 2) {
            setError('name', 'Informe seu nome completo');
            valid = false;
        } else {
            setError('name', '');
        }

        if (whatsVal.length < 10) {
            setError('whats', 'Informe um WhatsApp válido com DDD');
            valid = false;
        } else {
            setError('whats', '');
        }

        setError('insta', ''); // Instagram é opcional

        if (!valid) {
            // Foca no primeiro campo com erro
            const firstError = form.querySelector('.field.error input');
            if (firstError) firstError.focus();
            return;
        }

        const submitText = form.querySelector('button[type="submit"] span:first-child');
        submitText.textContent = 'Enviando...';

        try {
            await axios.post('/api/lead', {
                name:  nameVal,
                whats: whatsVal,
                insta: instaVal
            });
            window.location.href = PAYMENT_URL;
        } catch (error) {
            console.error(error);
            submitText.textContent = 'Garantir minha vaga agora';
            alert('Erro ao enviar. Verifique sua conexão e tente novamente.');
        }
    });
});
