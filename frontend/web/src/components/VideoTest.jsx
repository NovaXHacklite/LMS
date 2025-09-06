import React from 'react';
import ReactPlayer from 'react-player';

const VideoTest = () => {
    const testUrls = [
        "https://www.youtube.com/watch?v=RAGnDFbxF10",
        "https://www.youtube.com/watch?v=l7F8XrqKKBs",
        "https://www.youtube.com/watch?v=BRdMrTvgTDA"
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Video Test Component</h2>
            {testUrls.map((url, index) => (
                <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Video {index + 1}</h3>
                    <p>URL: {url}</p>
                    <div style={{ width: '560px', height: '315px', border: '1px solid red' }}>
                        <ReactPlayer
                            url={url}
                            controls
                            width="100%"
                            height="100%"
                            playing={false}
                            onError={(error) => console.error(`Video ${index + 1} Error:`, error)}
                            onReady={() => console.log(`Video ${index + 1} Ready`)}
                            config={{
                                youtube: {
                                    playerVars: {
                                        showinfo: 1,
                                        rel: 0,
                                        modestbranding: 1
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoTest;
