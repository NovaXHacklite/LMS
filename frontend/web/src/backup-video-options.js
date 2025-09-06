// Alternative embed URLs - if current ones don't work
const embedUrls = [
    "https://www.youtube.com/embed/RAGnDFbxF10",
    "https://www.youtube.com/embed/l7F8XrqKKBs",
    "https://www.youtube.com/embed/BRdMrTvgTDA",
    "https://www.youtube.com/embed/iBOcxVmSYYs",
    "https://www.youtube.com/embed/J_Hz7fudPLk"
];

// Or use direct iframe approach:
<iframe
    width="100%"
    height="100%"
    src={`https://www.youtube.com/embed/${videoId}`}
    title={lesson.title}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
/>
