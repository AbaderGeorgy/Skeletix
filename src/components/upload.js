export function initUploadPage() {
    initializeUpload();
    
    initializeNotifications();
    
    let uploadedFiles = [];
    
    function initializeUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        
        uploadZone.addEventListener('click', function(e) {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
        
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', function(e) {
            handleFiles(this.files);
        });
    }
    
    function handleFiles(files) {
        const fileListContainer = document.getElementById('fileList');
        
        if (fileListContainer.style.display !== 'block') {
            fileListContainer.style.display = 'block';
        }
        
        Array.from(files).forEach(file => {
            if (file.size > 50 * 1024 * 1024) {
                showNotification(`File "${file.name}" is too large. Maximum size is 50MB.`, 'error');
                return;
            }
            
            const validTypes = ['image/', 'application/pdf', '.dcm'];
            const isValidType = validTypes.some(type => 
                file.type.startsWith(type) || file.name.toLowerCase().endsWith('.dcm')
            );
            
            if (!isValidType) {
                showNotification(`File "${file.name}" is not a supported format.`, 'error');
                return;
            }
            
            const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
            
            uploadedFiles.push({
                id: fileId,
                file: file,
                status: 'uploading'
            });
            
            addFileToList(file, fileId);
            
            simulateUpload(fileId);
        });
    }
    
    function addFileToList(file, fileId) {
        const fileListContainer = document.getElementById('fileList');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.id = `file-${fileId}`;
        
        const fileIcon = getFileIcon(file);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-item__info">
                <div class="file-item__icon">${fileIcon}</div>
                <div class="file-item__details">
                    <div class="file-item__name">${escapeHtml(file.name)}</div>
                    <div class="file-item__size">${fileSize}</div>
                </div>
            </div>
            <div>
                <div class="progress">
                    <div class="progress__bar" id="progress-${fileId}"></div>
                </div>
                <span class="status status--uploading" id="status-${fileId}">Uploading...</span>
            </div>
        `;
        
        fileListContainer.appendChild(fileItem);
    }
    
    function simulateUpload(fileId) {
        const progressBar = document.getElementById(`progress-${fileId}`);
        const statusElement = document.getElementById(`status-${fileId}`);
        let progress = 0;
        
        const uploadInterval = setInterval(() => {
            progress += Math.random() * 10 + 5; 
            if (progress >= 100) {
                progress = 100;
                clearInterval(uploadInterval);
                
                statusElement.textContent = 'Analyzing...';
                statusElement.className = 'status status--analyzing';
                
                const fileIndex = uploadedFiles.findIndex(f => f.id === fileId);
                if (fileIndex !== -1) {
                    uploadedFiles[fileIndex].status = 'analyzing';
                }
                
                simulateAnalysis(fileId);
            }
            
            progressBar.style.width = progress + '%';
        }, 200);
    }
    
    function simulateAnalysis(fileId) {
        const statusElement = document.getElementById(`status-${fileId}`);
        let progress = 0;
        
        const analysisInterval = setInterval(() => {
            progress += Math.random() * 5 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(analysisInterval);
                
                statusElement.textContent = 'Complete';
                statusElement.className = 'status status--success';
                
                const fileIndex = uploadedFiles.findIndex(f => f.id === fileId);
                if (fileIndex !== -1) {
                    uploadedFiles[fileIndex].status = 'complete';
                }
                
                const fileName = uploadedFiles[fileIndex]?.file?.name || 'File';
                showNotification(`"${fileName}" analyzed successfully!`, 'success');
            }
        }, 300);
    }
    
    function getFileIcon(file) {
        if (file.type.startsWith('image/')) {
            return '🖼️';
        } else if (file.type === 'application/pdf') {
            return '📄';
        } else if (file.name.toLowerCase().endsWith('.dcm')) {
            return '🏥';
        } else {
            return '📁';
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function initializeNotifications() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
    }
    
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode === container) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    window.uploadSystem = {
        getUploadedFiles: () => [...uploadedFiles],
        clearFiles: () => {
            uploadedFiles = [];
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            fileList.style.display = 'none';
        }
    };
}
