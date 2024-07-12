import { View } from 'framework/views/view';
import { Events } from 'framework/events';
import template from 'templates/fingerprint.hbs';

class FingerprintView extends View {
    parent = '.app__fingerprint';

    template = template;

    events = {
        'click .fingerprint__btn-info': 'toggleInfo',
        'click .fingerprint__btn-reset': 'regenerate'
    };

    constructor(model) {
        super(model);

        this.listenTo(this.model.settings, 'change:fingerprint', this.render);
    }

    render() {
        super.render({ fingerprint: this.model.settings.fingerprint });
    }

    toggleInfo(e) {
        this.el.querySelector('.fingerprint__overlay-info').classList.toggle('hide');
    }

    regenerate(e) {
        Events.emit('generate-fingerprint');
    }
}

export { FingerprintView };
