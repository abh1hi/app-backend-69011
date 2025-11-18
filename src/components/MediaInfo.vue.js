import { ref, watch, onMounted } from 'vue';
const props = defineProps({
    initialMedia: {
        type: Object,
        default: () => ({ photos: [], videos: [] }),
    },
});
const emit = defineEmits(['update']);
const existingMedia = ref({ ...props.initialMedia });
const newPhotos = ref([]);
const newVideos = ref([]);
const deletedUrls = ref([]);
onMounted(() => {
    // Ensure initialMedia is reactive
    watch(() => props.initialMedia, (newVal) => {
        existingMedia.value = { ...newVal };
    }, { immediate: true, deep: true });
});
const handleFileUpload = (type, event) => {
    const target = event.target;
    if (target.files) {
        for (const file of Array.from(target.files)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewUrl = e.target?.result;
                if (type === 'photo') {
                    newPhotos.value.push({ file, previewUrl });
                }
                else {
                    newVideos.value.push({ file, previewUrl });
                }
                emitUpdates();
            };
            reader.readAsDataURL(file);
        }
    }
};
const deleteExistingMedia = (url, type) => {
    if (type === 'photo') {
        existingMedia.value.photos = existingMedia.value.photos.filter((p) => p !== url);
    }
    else {
        existingMedia.value.videos = existingMedia.value.videos.filter((v) => v !== url);
    }
    deletedUrls.value.push(url);
    emitUpdates();
};
const removeNewMedia = (type, index) => {
    if (type === 'photo') {
        newPhotos.value.splice(index, 1);
    }
    else {
        newVideos.value.splice(index, 1);
    }
    emitUpdates();
};
const emitUpdates = () => {
    const allNewFiles = [...newPhotos.value.map(p => p.file), ...newVideos.value.map(v => v.file)];
    emit('update', { newFiles: allNewFiles, deletedUrls: deletedUrls.value });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-section']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-label']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "media-info-container" },
});
if (__VLS_ctx.existingMedia.photos.length > 0 || __VLS_ctx.existingMedia.videos.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "existing-media-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "media-grid" },
    });
    for (const [url] of __VLS_getVForSourceType((__VLS_ctx.existingMedia.photos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (url),
            ...{ class: "media-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (url),
            ...{ class: "media-preview" },
            alt: "Photo",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.existingMedia.photos.length > 0 || __VLS_ctx.existingMedia.videos.length > 0))
                        return;
                    __VLS_ctx.deleteExistingMedia(url, 'photo');
                } },
            ...{ class: "delete-btn" },
        });
    }
    for (const [url] of __VLS_getVForSourceType((__VLS_ctx.existingMedia.videos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (url),
            ...{ class: "media-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
            src: (url),
            ...{ class: "media-preview" },
            controls: true,
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.existingMedia.photos.length > 0 || __VLS_ctx.existingMedia.videos.length > 0))
                        return;
                    __VLS_ctx.deleteExistingMedia(url, 'video');
                } },
            ...{ class: "delete-btn" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "upload-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "upload-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "photo-upload",
    ...{ class: "upload-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "upload-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "upload-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.handleFileUpload('photo', $event);
        } },
    id: "photo-upload",
    type: "file",
    multiple: true,
    accept: "image/*",
    ...{ class: "file-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "upload-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "video-upload",
    ...{ class: "upload-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "upload-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "upload-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.handleFileUpload('video', $event);
        } },
    id: "video-upload",
    type: "file",
    multiple: true,
    accept: "video/*",
    ...{ class: "file-input" },
});
if (__VLS_ctx.newPhotos.length > 0 || __VLS_ctx.newVideos.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "new-media-preview-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "media-grid" },
    });
    for (const [file, index] of __VLS_getVForSourceType((__VLS_ctx.newPhotos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: "media-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (file.previewUrl),
            ...{ class: "media-preview" },
            alt: "New Photo",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.newPhotos.length > 0 || __VLS_ctx.newVideos.length > 0))
                        return;
                    __VLS_ctx.removeNewMedia('photo', index);
                } },
            ...{ class: "delete-btn" },
        });
    }
    for (const [file, index] of __VLS_getVForSourceType((__VLS_ctx.newVideos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: "media-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
            src: (file.previewUrl),
            ...{ class: "media-preview" },
            controls: true,
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.newPhotos.length > 0 || __VLS_ctx.newVideos.length > 0))
                        return;
                    __VLS_ctx.removeNewMedia('video', index);
                } },
            ...{ class: "delete-btn" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['media-info-container']} */ ;
/** @type {__VLS_StyleScopedClasses['existing-media-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['media-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-box']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-label']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
/** @type {__VLS_StyleScopedClasses['file-input']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-box']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-label']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
/** @type {__VLS_StyleScopedClasses['file-input']} */ ;
/** @type {__VLS_StyleScopedClasses['new-media-preview-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['media-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            existingMedia: existingMedia,
            newPhotos: newPhotos,
            newVideos: newVideos,
            handleFileUpload: handleFileUpload,
            deleteExistingMedia: deleteExistingMedia,
            removeNewMedia: removeNewMedia,
        };
    },
    emits: {},
    props: {
        initialMedia: {
            type: Object,
            default: () => ({ photos: [], videos: [] }),
        },
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        initialMedia: {
            type: Object,
            default: () => ({ photos: [], videos: [] }),
        },
    },
});
; /* PartiallyEnd: #4569/main.vue */
