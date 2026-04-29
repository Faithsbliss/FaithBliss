import mongoose from 'mongoose';

const PressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['pressRelease', 'newsHighlight', 'award'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        trim: true,
        required: function() { return this.type === 'pressRelease'; }
    },
    link: {
        type: String,
        trim: true,
        required: function() { return this.type === 'pressRelease' || this.type === 'newsHighlight'; }
    },
    year: {
        type: String,
        trim: true,
        required: function() { return this.type === 'award'; }
    },
    award: {
        type: String,
        trim: true,
        required: function() { return this.type === 'award'; }
    }
}, { timestamps: true });

const Press = mongoose.model('Press', PressSchema);

export default Press;