// Update Checker for Wisdom Cards App
class UpdateChecker {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateCheckInterval = 6 * 60 * 60 * 1000; // 6 hours
    this.dataUrl = 'wisdom-data.json';
  }

  async checkForUpdates() {
    try {
      // Check if we're online
      if (!navigator.onLine) {
        console.log('Update Checker: Offline, skipping check');
        return false;
      }

      // Fetch latest data
      const response = await fetch(this.dataUrl + '?t=' + Date.now());
      const newData = await response.json();
      
      // Get stored version
      const storedVersion = localStorage.getItem('wisdomVersion') || '1.0.0';
      
      // Compare versions
      if (this.compareVersions(newData.version, storedVersion) > 0) {
        console.log('Update Checker: New version available', newData.version);
        this.showUpdateNotification(newData);
        return true;
      }
      
      console.log('Update Checker: Already up to date');
      return false;
      
    } catch (error) {
      console.error('Update Checker: Failed to check for updates:', error);
      return false;
    }
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }

  showUpdateNotification(data) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <h3><i class="fas fa-sync-alt"></i> Update Available</h3>
        <p>New wisdom database v${data.version} is available!</p>
        <p><small>${data.total_wisdom} wisdom entries</small></p>
        <div class="update-actions">
          <button class="btn-primary" id="updateNowBtn">Update Now</button>
          <button class="btn-secondary" id="updateLaterBtn">Later</button>
        </div>
      </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('update-notification-style')) {
      const style = document.createElement('style');
      style.id = 'update-notification-style';
      style.textContent = `
        .update-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          padding: 20px;
          z-index: 10000;
          max-width: 300px;
          animation: slideIn 0.3s ease;
          border-left: 5px solid #3498db;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .update-content h3 {
          color: #2c3e50;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .update-content p {
          color: #555;
          margin-bottom: 5px;
        }
        .update-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById('updateNowBtn').addEventListener('click', () => {
      localStorage.clear();
      window.location.reload();
    });
    
    document.getElementById('updateLaterBtn').addEventListener('click', () => {
      notification.remove();
      // Don't show again for 24 hours
      localStorage.setItem('lastUpdateNotification', Date.now().toString());
    });
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 30000);
  }

  scheduleUpdateChecks() {
    // Check immediately
    setTimeout(() => this.checkForUpdates(), 5000);
    
    // Then check periodically
    setInterval(() => {
      this.checkForUpdates();
    }, this.updateCheckInterval);
    
    // Also check when app comes online
    window.addEventListener('online', () => {
      setTimeout(() => this.checkForUpdates(), 2000);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const updateChecker = new UpdateChecker();
  updateChecker.scheduleUpdateChecks();
});
