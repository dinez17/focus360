// Converts "CCTV Bullet Camera" -> "cctv-bullet-camera"
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // remove non-word characters
        .replace(/[\s_-]+/g, '-')  // collapse whitespace/underscores into single dash
        .replace(/^-+|-+$/g, '');  // trim leading/trailing dashes
};

// Ensures uniqueness by appending a short suffix if the slug already exists
export const generateUniqueSlug = async (Model, text) => {
    const baseSlug = slugify(text);
    let slug = baseSlug;
    let counter = 1;

    while (await Model.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};