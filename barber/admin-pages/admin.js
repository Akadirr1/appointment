document.addEventListener('DOMContentLoaded', () => {
    // ----- DOM ELEMENTLERİ -----
    const availabilityForm = document.getElementById('availability-form');
    const scheduleContainer = document.querySelector('.weekly-schedule');
    const saveButton = document.querySelector('.save-button');
    const saveStatus = document.getElementById('save-status');
    // Opsiyonel: Kullanıcı adı ve çıkış
    const barberNamePlaceholder = document.getElementById('barber-name-placeholder');
    const logoutButton = document.getElementById('logout-button');

    // ----- HAFTANIN GÜNLERİ (Kolay erişim için) -----
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // ----- ÖRNEK MEVCUT AYARLAR (Simülasyon - Backend'den alınmalı) -----
    const currentAvailabilitySettings = {
        monday: { working: true, start: '09:00', end: '18:00' },
        tuesday: { working: true, start: '09:00', end: '18:00' },
        wednesday: { working: false, start: '', end: '' },
        thursday: { working: true, start: '10:00', end: '19:00' },
        friday: { working: true, start: '09:00', end: '17:00' },
        saturday: { working: true, start: '10:00', end: '15:00' },
        sunday: { working: false, start: '', end: '' }
    };

    // ----- BAŞLANGIÇ -----
    function initializePage() {
        // loadBarberInfo(); // Berber bilgilerini yükle (backend'den)
        loadCurrentAvailability(); // Mevcut ayarları forma yükle
        addEventListeners();
    }

    function addEventListeners() {
		// Form gönderimini (sayfa yenilemesini) engelle ve kaydetmeyi tetikle
		if(availabilityForm) {
			availabilityForm.addEventListener('submit', handleFormSubmit);
		} else {
			console.error("Hata: availabilityForm bulunamadı!");
		}
	
	
		// --- CHECKBOX DEĞİŞİKLİK DİNLEYİCİSİ ---
		// scheduleContainer bulunduğundan emin ol (JS dosyasının başında tanımlanmalı)
		if (scheduleContainer) {
			 // Tüm "working-checkbox" class'ına sahip checkbox'ları seç
			scheduleContainer.querySelectorAll('.working-checkbox').forEach(checkbox => {
				 // Her bir checkbox için 'change' olayını dinle
				checkbox.addEventListener('change', handleWorkingStatusChange);
			});
		} else {
			console.error("Hata: scheduleContainer bulunamadı!");
		}
		// --- Dinleyici Sonu ---
	
	
		 // if(logoutButton) logoutButton.addEventListener('click', handleLogout); // Opsiyonel
	}

    // ----- FORM YÖNETİMİ -----

    // Mevcut ayarları forma yükle
    function loadCurrentAvailability() {
        // Gerçekte: fetch('/api/barber/my-availability') ile veri çekilir
        console.log("Mevcut ayarlar forma yükleniyor (simülasyon)...");
        const settings = currentAvailabilitySettings; // Simülasyon verisini kullan

        daysOfWeek.forEach(day => {
            const daySettings = settings[day];
            if (daySettings) {
                const workingCheckbox = document.getElementById(`${day}-working`);
                const startInput = document.getElementById(`${day}-start`);
                const endInput = document.getElementById(`${day}-end`);

                if (workingCheckbox && startInput && endInput) {
                    workingCheckbox.checked = daySettings.working;
                    startInput.value = daySettings.start || ''; // null veya undefined ise boş string
                    endInput.value = daySettings.end || '';

                    // Başlangıçta time inputlarının durumunu ayarla
                    startInput.disabled = !daySettings.working;
                    endInput.disabled = !daySettings.working;
                }
            }
        });
    }

    // "Çalışıyor" checkbox'ı değiştiğinde time inputları yönet
    function handleWorkingStatusChange(event) {
		const checkbox = event.target; // Olayı tetikleyen checkbox
		// Checkbox'ın en yakın '.day-schedule' class'ına sahip üst elemanını bul
		const dayScheduleElement = checkbox.closest('.day-schedule');
	
		// Eğer üst eleman bulunamazsa veya 'data-day' attribute'u yoksa çık
		if (!dayScheduleElement || !dayScheduleElement.dataset.day) {
			console.error("İlgili gün elementi (day-schedule) veya data-day attribute'u bulunamadı.", checkbox);
			return;
		}
	
		const day = dayScheduleElement.dataset.day; // İlgili günü al (örn: 'monday')
	
		// İlgili başlangıç ve bitiş inputlarını ID ile bul
		const startInput = document.getElementById(`${day}-start`);
		const endInput = document.getElementById(`${day}-end`);
	
		// Inputlar bulunduysa devam et
		if (startInput && endInput) {
			const isWorking = checkbox.checked; // Checkbox işaretli mi?
	
			// Input'ların 'disabled' özelliğini ayarla:
			// Checkbox işaretli (isWorking=true) ise disabled=false (aktif)
			// Checkbox işaretsiz (isWorking=false) ise disabled=true (pasif)
			startInput.disabled = !isWorking;
			endInput.disabled = !isWorking;
	
			// Eğer "çalışmıyor" seçildiyse saatleri temizle (isteğe bağlı)
			if (!isWorking) {
				startInput.value = '';
				endInput.value = '';
				// İsteğe bağlı: Hata durumunda kalan border rengini temizle
				startInput.style.borderColor = '';
				endInput.style.borderColor = '';
			}
		} else {
			console.error(`${day} için başlangıç veya bitiş inputları bulunamadı.`);
		}
	}

    // Form gönderildiğinde (Kaydet butonuna tıklandığında)
    async function handleFormSubmit(event) {
        event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
        console.log("Form gönderildi, ayarlar kaydediliyor...");

        saveButton.disabled = true; // Butonu pasifleştir
        saveStatus.textContent = 'Kaydediliyor...';
        saveStatus.className = 'save-status'; // Önceki hata/başarı stilini temizle

        // Form verilerini topla
        const newAvailability = {};
        let hasError = false;
        daysOfWeek.forEach(day => {
            const workingCheckbox = document.getElementById(`${day}-working`);
            const startInput = document.getElementById(`${day}-start`);
            const endInput = document.getElementById(`${day}-end`);

            const isWorking = workingCheckbox.checked;
            const startTime = startInput.value;
            const endTime = endInput.value;

            // Basit doğrulama: Çalışıyor ise saatler boş olamaz
            if (isWorking && (!startTime || !endTime)) {
                 alert(`${day.charAt(0).toUpperCase() + day.slice(1)} günü için başlangıç ve bitiş saatlerini girmelisiniz.`);
                 startInput.style.borderColor = 'red'; // Hatalı alanı işaretle
                 endInput.style.borderColor = 'red';
                 hasError = true;
            } else if (isWorking && startTime >= endTime) {
                 alert(`${day.charAt(0).toUpperCase() + day.slice(1)} günü için başlangıç saati bitiş saatinden önce olmalıdır.`);
                 startInput.style.borderColor = 'red';
                 endInput.style.borderColor = 'red';
                 hasError = true;
            } else {
                startInput.style.borderColor = ''; // Hata yoksa işareti kaldır
                endInput.style.borderColor = '';
            }

            newAvailability[day] = {
                working: isWorking,
                start: isWorking ? startTime : '', // Çalışmıyorsa boş gönder
                end: isWorking ? endTime : ''
            };
        });

        if (hasError) {
            saveStatus.textContent = 'Lütfen hataları düzeltin.';
            saveStatus.classList.add('error');
            saveButton.disabled = false; // Butonu tekrar aktif et
            return; // Kaydetme işlemine devam etme
        }

        console.log("Kaydedilecek Veri:", newAvailability);

        // ---- Backend İsteği (Simülasyon) ----
        try {
            // Gerçek istek:
            // const response = await fetch('/api/barber/my-availability', {
            //     method: 'PUT', // veya POST
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // 'Authorization': `Bearer ${getToken()}` // Oturum anahtarı
            //     },
            //     body: JSON.stringify(newAvailability)
            // });
            // if (!response.ok) {
            //      const errorData = await response.json();
            //      throw new Error(errorData.message || 'Ayarlar kaydedilemedi.');
            // }
            // const result = await response.json();

            // Simülasyon: 1 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Ayarlar başarıyla kaydedildi (simülasyon).");

            saveStatus.textContent = 'Ayarlar başarıyla kaydedildi!';
            saveStatus.classList.remove('error');
             // Belki kaydedilen ayarları global değişkene de atayabiliriz
             Object.assign(currentAvailabilitySettings, newAvailability);


        } catch (error) {
            console.error("Kaydetme hatası:", error);
            saveStatus.textContent = `Hata: ${error.message}`;
            saveStatus.classList.add('error');
        } finally {
            saveButton.disabled = false; // Butonu tekrar aktif et
             // Mesajın bir süre sonra kaybolması (opsiyonel)
             setTimeout(() => {
                 saveStatus.textContent = '';
                 saveStatus.className = 'save-status';
             }, 3000); // 3 saniye sonra temizle
        }
        // ---- Backend İsteği Sonu ----
    }

    // ----- Sayfa Yüklendiğinde Başlat -----
    initializePage();

}); // DOMContentLoaded sonu