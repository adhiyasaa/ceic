const fs = require('fs');
let content = fs.readFileSync('register.html', 'utf8');

// 1. eventData.Seminar replacement
content = content.replace(
    /Seminar: \{\s*pricing: `<p>Coming Soon<\/p>`,\s*dates: `<p><strong>Event Date:<\/strong> 23 May 2026<\/p>`,\s*contact: `\s*<p><strong>Vita<\/strong><\/p>\s*<p>WA: \+62 821-3411-0186<\/p>\s*<hr style="margin: 8px 0; border-color: rgba\(0,0,0,0\.1\);">\s*<p><strong>Tama<\/strong><\/p>\s*<p>WA: \+62 895-3332-85030<\/p>\s*`,\s*feeText: 'Coming Soon'\s*\}/g,
    `Seminar: {
                pricing: \`
                    <p><strong>Single (Internal):</strong> Rp 80.000</p>
                    <p><strong>Single (External):</strong> Rp 90.000</p>
                    <p><strong>Bundling 2 (Duo):</strong> Rp 170.000</p>
                    <p><strong>Bundling 3 (Trio):</strong> Rp 250.000</p>
                \`,
                dates: \`
                    <p><strong>Event Date:</strong> 23 May 2026</p>
                    <p><strong>Registration:</strong> 5 - 15 May 2026</p>
                \`,
                contact: \`
                    <p><strong>Vita</strong></p>
                    <p>WA: +62 821-3411-0186</p>
                    <hr style="margin: 8px 0; border-color: rgba(0,0,0,0.1);">
                    <p><strong>Tama</strong></p>
                    <p>WA: +62 895-3332-85030</p>
                \`,
                terms: \`
                    <p style="font-weight: bold; margin-bottom: 0.5rem; color: #222;">Do’s</p>
                    <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: #555; font-size: 0.85rem; line-height: 1.4;">
                        <li>Please arrive on time</li>
                        <li>Make sure to bring your ticket</li>
                        <li>Don’t forget your ID</li>
                        <li>Bring your own medication if needed</li>
                    </ul>
                    <p style="font-weight: bold; margin-bottom: 0.5rem; color: #222;">Don’ts</p>
                    <ul style="padding-left: 1.25rem; color: #555; font-size: 0.85rem; line-height: 1.4;">
                        <li>No pets allowed</li>
                        <li>Outside food and drinks are not permitted</li>
                        <li>Please do not bring flammable items</li>
                        <li>No weapons allowed</li>
                        <li>Drugs are strictly prohibited</li>
                        <li>No smoking inside the venue</li>
                    </ul>
                \`,
                feeText: 'Single: Rp 80k/90k | Bundling 2: Rp 170k | Bundling 3: Rp 250k'
            }`
);

// 2. Add termsCard to sidebar
const sidebarRegex = /(<div class="sidebar-card compact" id="contactCard">[\s\S]*?<\/div>\s*)(<\/aside>)/g;
content = content.replace(sidebarRegex, `$1<div class="sidebar-card compact" id="termsCard" style="display: none;">
                        <h4><i data-lucide="file-text"></i> Terms and Conditions</h4>
                        <div id="termsInfo">
                            <p class="contact-hint">Select an event to see terms</p>
                        </div>
                    </div>
                $2`);

// 3. Update Sidebar script
const updateSidebarRegex = /(const contactContainer = document\.getElementById\('contactInfo'\);\n\s*const feeDisplay = document\.getElementById\('feeDisplay'\);\n\s*const posterContainer = document\.getElementById\('posterPreview'\);\n)/g;
content = content.replace(updateSidebarRegex, `$1const termsCard = document.getElementById('termsCard');
            const termsContainer = document.getElementById('termsInfo');\n`);

const sidebarLogicRegex = /(contactContainer\.innerHTML = eventData\[eventValue\]\.contact;\n\s*feeDisplay\.textContent = eventData\[eventValue\]\.feeText;\n)/g;
content = content.replace(sidebarLogicRegex, `$1
                if (eventData[eventValue].terms && termsCard) {
                    termsCard.style.display = 'block';
                    termsContainer.innerHTML = eventData[eventValue].terms;
                } else if (termsCard) {
                    termsCard.style.display = 'none';
                    termsContainer.innerHTML = '';
                }\n`);

const sidebarResetRegex = /(contactContainer\.innerHTML = \`<p class="contact-hint">Select an event to see contact info<\/p>\`;\n\s*feeDisplay\.textContent = 'Select an event to see pricing';\n)/g;
content = content.replace(sidebarResetRegex, `$1                if (termsCard) {
                    termsCard.style.display = 'none';
                    termsContainer.innerHTML = '';
                }\n`);

// 4. Inject seminarForm next to workshopForm HTML
const insertFormRegex = /(<!-- WORKSHOP FORM - Hidden by default -->[\s\S]*?<\/div>)(?![\s\S]*<!-- SEMINAR FORM - Hidden by default -->)/g;
const seminarFormHTML = `
                    <!-- SEMINAR FORM - Hidden by default -->
                    <div id="seminarForm" style="display: none;">
                        <div class="form-section-compact">
                            <h3 class="form-section-title-compact">
                                <i data-lucide="package"></i> Select Your Package
                            </h3>
                            <select class="form-select compact" name="seminarPackage" id="seminarPackage" onchange="handleSeminarPackageChange()">
                                <option value="">Select Package *</option>
                                <option value="Single">Single</option>
                                <option value="Duo">Duo</option>
                                <option value="Trio">Trio</option>
                            </select>
                        </div>
                        <div class="form-section-compact" id="seminarReferralSection" style="display: none;">
                            <h3 class="form-section-title-compact">
                                <i data-lucide="tag"></i> Referral Code
                            </h3>
                            <p style="font-size: 0.95rem; color: #222; font-weight: 600; margin-bottom: 0.75rem;">Do you have a referral code?</p>
                            <div style="display: flex; gap: 1.25rem; margin-bottom: 0.75rem;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; font-weight: 500; color: #333;">
                                    <input type="radio" name="seminarHasReferral" value="yes" onchange="toggleSeminarReferralInput()" style="width: 18px; height: 18px; accent-color: var(--green);"> Yes
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; font-weight: 500; color: #333;">
                                    <input type="radio" name="seminarHasReferral" value="no" onchange="toggleSeminarReferralInput()" checked style="width: 18px; height: 18px; accent-color: var(--green);"> No
                                </label>
                            </div>
                            <div id="seminarReferralCodeInput" style="display: none;">
                                <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                                    <input type="text" class="form-input compact" name="seminarReferralCode" id="seminarReferralCode" placeholder="Enter Referral Code" style="flex: 1; text-transform: uppercase;">
                                    <button type="button" id="verifySeminarReferralBtn" onclick="verifySeminarReferralCode()" style="padding: 0.65rem 1.25rem; background: var(--green); color: #fff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.3s ease; min-height: 42px;">Verify</button>
                                </div>
                                <div id="seminarReferralErrorMsg" style="display: none; margin-top: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.3); border-radius: 8px; color: #dc3545; font-size: 0.85rem; font-weight: 500;">
                                    Invalid referral code.
                                </div>
                                <div id="seminarReferralSuccessMsg" style="display: none; margin-top: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 8px; color: #2e7d32; font-size: 0.85rem; font-weight: 500;">
                                    Referral code applied successfully!
                                </div>
                            </div>
                        </div>
                        <div class="form-section-compact" id="seminarPriceDisplay" style="display: none;">
                            <div style="padding: 1rem; background: rgba(76,175,80,0.08); border-radius: 12px; border-left: 4px solid var(--green); text-align: center;">
                                <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.25rem;">Your Registration Fee</p>
                                <p id="seminarPriceAmount" style="font-size: 1.5rem; font-weight: 700; color: var(--green); margin: 0;"></p>
                            </div>
                        </div>
                        <div id="seminarPersonsContainer">
                        </div>
                        <div class="form-section-compact">
                            <h3 class="form-section-title-compact">
                                <i data-lucide="file-text"></i> Payment
                            </h3>
                            <div class="file-upload-compact">
                                <label>Payment Proof *</label>
                                <input type="file" class="form-file compact" name="seminarPaymentProof" accept="image/*,.pdf" id="seminarPaymentProof">
                            </div>
                        </div>
                    </div>
`;
content = content.replace(insertFormRegex, `$1\n${seminarFormHTML}`);

// 5. toggleFormType JS update
const mainEventsRegex = /const mainEvents = \['Workshop', 'Seminar', 'Webinar', 'COMPEX'\];/g;
content = content.replace(mainEventsRegex, `const mainEvents = ['Workshop', 'Webinar', 'COMPEX'];`);

const toggleFormTypeHideRegex = /(workshopForm\.style\.display = 'none';\n\s*toggleRequiredFields\('competitionForm', false\);\n\s*toggleRequiredFields\('individualForm', false\);\n\s*toggleRequiredFields\('workshopForm', false\);\n)/g;
content = content.replace(toggleFormTypeHideRegex, `$1            const seminarForm = document.getElementById('seminarForm');
            if (seminarForm) { seminarForm.style.display = 'none'; toggleRequiredFields('seminarForm', false); }\n`);

const toggleFormTypeShowRegex = /(                resetWorkshopForm\(\);\n            \} else if \(mainEvents\.includes\(eventValue\)\) \{)/g;
content = content.replace(toggleFormTypeShowRegex, `                resetWorkshopForm();
            } else if (eventValue === 'Seminar') {
                const seminarForm = document.getElementById('seminarForm');
                if (seminarForm) { seminarForm.style.display = 'block'; toggleRequiredFields('seminarForm', true); }
                document.getElementById('paymentInfo').style.display = 'none';
                if(typeof resetSeminarForm === 'function') resetSeminarForm();
            } else if (mainEvents.includes(eventValue)) {`);

fs.writeFileSync('register.html', content, 'utf8');
console.log('Phase 1 JS replacement done');
