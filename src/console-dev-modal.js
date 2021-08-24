const isVisible = 'is-visible';

export default class ConsoleDevModal {
    constructor(props) {
        let defaultConfig = {
            orgId: null,
            orgName: '',
            email: '',
            userToken: null,
            env: 'stage',
            apiKey: 'UDPWeb1'
        };

        this.config = Object.assign(defaultConfig, props);
        this.baseUrl = this.config.env === 'prod' ? 'developers.adobe.io' : 'developers-stage.adobe.io';

        if (this.config.orgId && this.config.userToken) {
            this.checkTerms();
        }
    }

    addEventsListeners() {
        const closeEls = document.querySelectorAll('[data-close]');
        const acceptBtn = document.getElementById('acceptBtn');

        for (const el of closeEls) {
            el.addEventListener('click', () => {
                this.parentElement.parentElement.parentElement.classList.remove(isVisible);
            });
        }

        document.addEventListener('click', e => {
            if (e.target == document.querySelector('.modal.is-visible')) {
                document.querySelector('.modal.is-visible').classList.remove(isVisible);
            }
        });

        document.addEventListener('keyup', e => {
            // if we press the ESC
            if (e.key == 'Escape' && document.querySelector('.modal.is-visible')) {
                document.querySelector('.modal.is-visible').classList.remove(isVisible);
            }
        });

        acceptBtn.addEventListener('click', () => {
            this.acceptTerms();
        });
    }

    checkTerms() {
        fetch('https://' + this.baseUrl + '/console/services/ims/organizations/' + this.config.orgId + '/terms', {
            method: 'GET',
            headers: { 'x-api-key': this.config.apiKey, 'Authorization': this.config.userToken }
        }).then(res => {
            res.json().then(response => {
                if (!response.accepted || !response.current) {
                    document.body.innerHTML +=
                        '<div class="modal" id="dev-modal">\n' +
                        '    <div class="modal-dialog">\n' +
                        '        <header class="modal-header">\n' +
                        '            Updates to the Developer Terms of Use\n' +
                        '            <button class="close-modal" aria-label="close modal" data-close>\n' +
                        '                ✕\n' +
                        '            </button>\n' +
                        '        </header>\n' +
                        '        <section class="modal-content">\n' +
                        '            <p>The Adobe Developer Terms of Use have recently been updated and\n' +
                        '            you must read and accept the updated terms before continuing to\n' +
                        '            access the Adobe Developer Console and use the Adobe Developer\n' +
                        '            Tools.</p>\n' +
                        '            <br/>\n' +
                        '            <a href="https://www.adobe.com/go/developer-terms">Adobe Developer Terms of Use</a>\n' +
                        '            <br/>\n' +
                        '            <p>By clicking “Accept and continue”, you confirm that you have read and\n' +
                        '            accepted the Adobe Developer Terms of Use for\n' +
                        '                <b>' +
                        this.config.email +
                        '</b> in <b>' +
                        this.config.orgName +
                        '</b> organization and\n' +
                        '            that you are authorized to do so on behalf of the organization.</p>\n' +
                        '        </section>\n' +
                        '        <footer class="modal-footer">\n' +
                        '            <button type="button" class="open-modal" id="acceptBtn">Accept and continue</button>\n' +
                        '        </footer>\n' +
                        '    </div>\n' +
                        '</div>';

                    this.addEventsListeners();

                    document.getElementById('dev-modal').classList.add(isVisible);
                }
            });
        });
    }

    acceptTerms() {
        fetch('https://' + this.baseUrl + '/console/services/ims/organizations/' + this.config.orgId + '/terms', {
            method: 'POST',
            headers: { 'x-api-key': this.config.apiKey, 'Authorization': this.config.userToken }
        }).then(res => {
            res.json().then(response => {
                if (response.accepted) {
                    document.querySelector('.modal.is-visible').classList.remove(isVisible);
                } else {
                    window.alert('There was an error when trying to accept dev terms for org ' + this.config.orgId);
                }
            });
        });
    }
}
