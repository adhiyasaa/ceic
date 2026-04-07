const fs = require('fs');
let content = fs.readFileSync('register.html', 'utf8');

// 1. Inject seminar forms JS
const seminarJs = `
        // ===== SEMINAR-SPECIFIC FUNCTIONS =====
        let seminarReferralVerified = false;

        function resetSeminarForm() {
            const packageSelect = document.getElementById('seminarPackage');
            if(packageSelect) packageSelect.value = '';
            const referralSection = document.getElementById('seminarReferralSection');
            if(referralSection) referralSection.style.display = 'none';
            const personsContainer = document.getElementById('seminarPersonsContainer');
            if(personsContainer) personsContainer.innerHTML = '';
            const priceDisplay = document.getElementById('seminarPriceDisplay');
            if(priceDisplay) priceDisplay.style.display = 'none';
            seminarReferralVerified = false;
            
            const noRadio = document.querySelector('input[name="seminarHasReferral"][value="no"]');
            if (noRadio) noRadio.checked = true;
            
            const referralInput = document.getElementById('seminarReferralCodeInput');
            if (referralInput) referralInput.style.display = 'none';
            
            const referralCode = document.getElementById('seminarReferralCode');
            if (referralCode) {
                referralCode.value = '';
                referralCode.removeAttribute('required');
                referralCode.disabled = false;
            }
            const errorMsg = document.getElementById('seminarReferralErrorMsg');
            if(errorMsg) errorMsg.style.display = 'none';
            const successMsg = document.getElementById('seminarReferralSuccessMsg');
            if(successMsg) successMsg.style.display = 'none';
            
            const verifyBtn = document.getElementById('verifySeminarReferralBtn');
            if (verifyBtn) {
                verifyBtn.textContent = 'Verify';
                verifyBtn.style.background = 'var(--green)';
                verifyBtn.disabled = false;
            }
        }

        function handleSeminarPackageChange() {
            const packageValue = document.getElementById('seminarPackage').value;
            const referralSection = document.getElementById('seminarReferralSection');
            
            seminarReferralVerified = false;
            const noRadio = document.querySelector('input[name="seminarHasReferral"][value="no"]');
            if(noRadio) noRadio.checked = true;
            toggleSeminarReferralInput();
            
            if (!packageValue) {
                referralSection.style.display = 'none';
                document.getElementById('seminarPersonsContainer').innerHTML = '';
                document.getElementById('seminarPriceDisplay').style.display = 'none';
                return;
            }

            referralSection.style.display = packageValue === 'Single' ? 'block' : 'none';
            updateSeminarPrice();
            
            const count = packageValue === 'Single' ? 1 : packageValue === 'Duo' ? 2 : 3;
            generateSeminarPersonForms(count);
        }

        function toggleSeminarReferralInput() {
            const hasReferralObj = document.querySelector('input[name="seminarHasReferral"]:checked');
            const hasReferral = hasReferralObj ? hasReferralObj.value : 'no';
            const referralInput = document.getElementById('seminarReferralCodeInput');
            const referralCode = document.getElementById('seminarReferralCode');

            seminarReferralVerified = false;
            document.getElementById('seminarReferralErrorMsg').style.display = 'none';
            document.getElementById('seminarReferralSuccessMsg').style.display = 'none';

            if (hasReferral === 'yes') {
                referralInput.style.display = 'block';
                referralCode.setAttribute('required', '');
                referralCode.value = '';
                referralCode.disabled = false;
                const verifyBtn = document.getElementById('verifySeminarReferralBtn');
                if(verifyBtn) {
                    verifyBtn.disabled = false;
                    verifyBtn.textContent = 'Verify';
                    verifyBtn.style.background = 'var(--green)';
                }
            } else {
                referralInput.style.display = 'none';
                referralCode.removeAttribute('required');
                referralCode.value = '';
            }

            updateSeminarPrice();
            const packageValue = document.getElementById('seminarPackage').value;
            if (packageValue) {
                generateSeminarPersonForms(packageValue === 'Single' ? 1 : (packageValue === 'Duo' ? 2 : 3));
            }
        }

        function verifySeminarReferralCode() {
            const code = document.getElementById('seminarReferralCode').value.trim();
            const errorMsg = document.getElementById('seminarReferralErrorMsg');
            const successMsg = document.getElementById('seminarReferralSuccessMsg');
            const verifyBtn = document.getElementById('verifySeminarReferralBtn');
            const input = document.getElementById('seminarReferralCode');

            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            if (!code) {
                errorMsg.innerHTML = '<i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> Please enter a referral code.';
                errorMsg.style.display = 'block';
                lucide.createIcons();
                return;
            }

            if (code.length >= 3) {
                seminarReferralVerified = true;
                successMsg.innerHTML = '<i data-lucide="check-circle" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> Referral code applied successfully!';
                successMsg.style.display = 'block';
                input.disabled = true;
                verifyBtn.textContent = '✓ Verified';
                verifyBtn.style.background = '#2e7d32';
                verifyBtn.disabled = true;
            } else {
                seminarReferralVerified = false;
                errorMsg.innerHTML = '<i data-lucide="alert-circle" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> Invalid referral code.';
                errorMsg.style.display = 'block';
            }
            lucide.createIcons();

            updateSeminarPrice();
            generateSeminarPersonForms(1); 
        }

        function updateSeminarPrice() {
            const packageValue = document.getElementById('seminarPackage').value;
            const priceDisplay = document.getElementById('seminarPriceDisplay');
            const priceAmount = document.getElementById('seminarPriceAmount');
            const feeDisplay = document.getElementById('feeDisplay');

            if (!packageValue) {
                priceDisplay.style.display = 'none';
                return;
            }

            priceDisplay.style.display = 'block';
            let amountText = '';

            if (packageValue === 'Single') {
                if (seminarReferralVerified) {
                    amountText = 'Rp 80.000 (Internal Single)';
                } else {
                    amountText = 'Rp 90.000 (External Single)';
                }
            } else if (packageValue === 'Duo') {
                amountText = 'Rp 170.000 (Bundling 2)';
            } else if (packageValue === 'Trio') {
                amountText = 'Rp 250.000 (Bundling 3)';
            }
            
            priceAmount.textContent = amountText;
            if(feeDisplay) feeDisplay.textContent = amountText;
        }

        function generateSeminarPersonForms(count) {
            const container = document.getElementById('seminarPersonsContainer');
            container.innerHTML = '';

            const packageValue = document.getElementById('seminarPackage').value;
            const isInternal = packageValue === 'Single' && seminarReferralVerified;

            for (let i = 1; i <= count; i++) {
                let extraFields = '';
                let studentIdRequired = isInternal;

                if (!isInternal) {
                    extraFields = \`
                        <h4 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.5rem; color: #4CAF50;">Professional Details</h4>
                        <div class="form-grid-2">
                            <select class="form-select compact" name="seminarProfession\${i}" required>
                                <option value="">Select Profession *</option>
                                <option value="Student">Student</option>
                                <option value="Industry Practitioner">Industry Practitioner</option>
                                <option value="Corporate Professional">Corporate Professional</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <h4 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.5rem; color: #4CAF50;">Contact & Location</h4>
                        <div class="form-grid-2">
                            <input type="tel" class="form-input compact" name="seminarWhatsapp\${i}" placeholder="WhatsApp Number *" required>
                            <input type="email" class="form-input compact" name="seminarEmail\${i}" placeholder="Email Address *" required>
                            <input type="text" class="form-input compact" name="seminarCountry\${i}" placeholder="Country Domicile *" required>
                            <input type="text" class="form-input compact" name="seminarProvince\${i}" placeholder="Province *" required>
                        </div>
                    \`;
                }

                const personHtml = \`
                    <div class="form-section-compact" style="margin-bottom: 1rem; padding-bottom: 1rem; \${i < count ? 'border-bottom: 1px dashed #eee;' : ''}">
                        <h3 class="form-section-title-compact">
                            <i data-lucide="user"></i> Personal Information \${count > 1 ? '- Person ' + i : ''}
                        </h3>
                        <div class="form-grid-2">
                            <input type="text" class="form-input compact" name="seminarName\${i}" placeholder="Name *" required>
                            <input type="text" class="form-input compact" name="seminarMajor\${i}" placeholder="Major *" required>
                            <input type="text" class="form-input compact" name="seminarInstitution\${i}" placeholder="Institution *" required>
                            <input type="text" class="form-input compact" name="seminarStudentIdNumber\${i}" placeholder="Student ID Number *" required>
                        </div>
                        
                        <h4 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.5rem; color: #4CAF50;">Documents</h4>
                        <div class="file-upload-compact" style="margin-bottom: 0.5rem;">
                            <label>Student ID \${studentIdRequired ? '*' : '(Optional)'}</label>
                            <input type="file" class="form-file compact" name="seminarStudentIdDoc\${i}" accept="image/*,.pdf" \${studentIdRequired ? 'required' : ''}>
                        </div>
                        
                        \${extraFields}
                    </div>
                \`;
                container.insertAdjacentHTML('beforeend', personHtml);
            }
            lucide.createIcons();
        }
`;

const jsInsertionRegex = /(\/\/ ===== WORKSHOP-SPECIFIC FUNCTIONS =====)/;
content = content.replace(jsInsertionRegex, seminarJs + '\n        $1');

// Update Submission Logic
const submitLogicRegex = /(\} else if \(eventType === 'Seminar'\) \{[\s\S]*?)(\} else \{)/;
// Wait, the original code had:
// } else {
//    // Individual form data (Seminar, COMPEX, Webinar)
//    // Special Handling for Seminar Bundled Tickets
//    if (eventType === 'Seminar') {
// This implies the submit block needs to be carefully replaced.
const oldSeminarSubmitRegex = /(\/\/ Special Handling for Seminar Bundled Tickets\s*if \(eventType === 'Seminar'\) \{[\s\S]*?\}\s*else\s*\{)([\s\S]*?)(\/\/ Standard Individual Submission)/;
// Actually I will replace the submit block with regex matching the exact code:
const submitBlockRegex = /(\} else if \(eventType === 'Workshop'\) \{[\s\S]*?formData\[\`person\${i}_studentIdName\`\] = studentIds\[i - 1\]\?\.name \|\| '';\n\s*\})(\s*\} else \{)/;

const seminarSubmitCode = `
                } else if (eventType === 'Seminar') {
                    const packageValue = document.getElementById('seminarPackage').value;
                    const hasReferral = seminarReferralVerified;
                    const referralCodeValue = hasReferral ? document.getElementById('seminarReferralCode').value : '';
                    const count = packageValue === 'Single' ? 1 : packageValue === 'Duo' ? 2 : 3;

                    const paymentFile = document.getElementById('seminarPaymentProof').files[0];
                    const paymentProof = await fileToBase64(paymentFile);

                    const studentIdPromises = [];
                    for (let i = 1; i <= count; i++) {
                        const fileInput = document.querySelector(\`input[name="seminarStudentIdDoc\${i}"]\`);
                        studentIdPromises.push(fileToBase64(fileInput?.files[0]));
                    }
                    const studentIds = await Promise.all(studentIdPromises);

                    formData = {
                        event: eventType,
                        package: packageValue,
                        hasReferral: hasReferral ? 'Yes' : 'No',
                        referralCode: referralCodeValue,
                        paymentProof: paymentProof.data,
                        paymentProofName: paymentProof.name
                    };

                    for (let i = 1; i <= count; i++) {
                        formData[\`person\${i}_name\`] = document.querySelector(\`input[name="seminarName\${i}"]\`)?.value || '';
                        formData[\`person\${i}_major\`] = document.querySelector(\`input[name="seminarMajor\${i}"]\`)?.value || '';
                        formData[\`person\${i}_institution\`] = document.querySelector(\`input[name="seminarInstitution\${i}"]\`)?.value || '';
                        formData[\`person\${i}_studentIdNumber\`] = document.querySelector(\`input[name="seminarStudentIdNumber\${i}"]\`)?.value || '';
                        
                        formData[\`person\${i}_studentIdDoc\`] = studentIds[i - 1]?.data || '';
                        formData[\`person\${i}_studentIdDocName\`] = studentIds[i - 1]?.name || '';

                        formData[\`person\${i}_profession\`] = document.querySelector(\`select[name="seminarProfession\${i}"]\`)?.value || '';
                        formData[\`person\${i}_whatsapp\`] = document.querySelector(\`input[name="seminarWhatsapp\${i}"]\`)?.value || '';
                        formData[\`person\${i}_email\`] = document.querySelector(\`input[name="seminarEmail\${i}"]\`)?.value || '';
                        formData[\`person\${i}_country\`] = document.querySelector(\`input[name="seminarCountry\${i}"]\`)?.value || '';
                        formData[\`person\${i}_province\`] = document.querySelector(\`input[name="seminarProvince\${i}"]\`)?.value || '';
                    }`;

content = content.replace(submitBlockRegex, `$1${seminarSubmitCode}$2`);

// Remove old seminar submit parsing
const oldSeminarParsingRegex = /(\/\/ Special Handling for Seminar Bundled Tickets\s*if \(eventType === 'Seminar'\) \{[\s\S]*?\}\s*else \{)([\s\S]*?)(formData = \{[\s\S]*?paymentProofName: paymentProof\.name,)([\s\S]*?ticketType: eventType === 'Seminar' \? document\.getElementById\('ticketType'\)\.value : ''[\s\S]*?\};)/;
content = content.replace(oldSeminarParsingRegex, `$2$3
                            ticketType: ''
                        };`);

// For the cleanup logic: 
const cleanupLogicRegex = /(document\.getElementById\('workshopPriceDisplay'\)\.style\.display = 'none';)/;
content = content.replace(cleanupLogicRegex, `$1
                    document.getElementById('seminarForm').style.display = 'none';
                    document.getElementById('seminarPersonsContainer').innerHTML = '';
                    document.getElementById('seminarPriceDisplay').style.display = 'none';`);

fs.writeFileSync('register.html', content, 'utf8');
console.log('Phase 2 JS replacement done');
