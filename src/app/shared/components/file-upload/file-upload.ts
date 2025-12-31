import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FileUploadInterface {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  preview?: string;
  error?: string;
}

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  @Input() acceptedTypes: string = 'image/*,.pdf,.doc,.docx';
  @Input() maxSize: number = 5242880; // 5MB par défaut
  @Input() maxFiles: number = 5;
  @Input() label: string = 'Télécharger des fichiers';
  @Input() helperText: string = 'Formats acceptés: Images, PDF, DOC (max 5MB)';

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() uploadComplete = new EventEmitter<FileUploadInterface[]>();

  public files = signal<FileUploadInterface[]>([]);
  public isDragging = signal(false);
  public isUploading = signal(false);
  public errorMessage = signal('');

  public hasFiles = computed(() => this.files().length > 0);
  public canAddMore = computed(() => this.files().length < this.maxFiles);
  public uploadProgress = computed(() => {
    const files = this.files();
    if (files.length === 0) return 0;
    const total = files.reduce((sum, f) => sum + f.progress, 0);
    return Math.round(total / files.length);
  });

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.handleFiles(Array.from(droppedFiles));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(newFiles: File[]): void {
    this.errorMessage.set('');
    
    // Vérifier le nombre maximum
    const currentCount = this.files().length;
    const availableSlots = this.maxFiles - currentCount;
    
    if (newFiles.length > availableSlots) {
      this.errorMessage.set(`Maximum ${this.maxFiles} fichiers autorisés`);
      newFiles = newFiles.slice(0, availableSlots);
    }

    // Valider et ajouter les fichiers
    const validFiles: FileUploadInterface[] = [];
    
    for (const file of newFiles) {

      // Vérifier la taille
      if (file.size > this.maxSize) {
        this.errorMessage.set(`${file.name} est trop volumineux (max ${this.formatBytes(this.maxSize)})`);
        continue;
      }

      // Vérifier le type de fichier
      if (!this.isFileTypeAllowed(file)) {
        this.errorMessage.set(`${file.name} n'est pas un type de fichier autorisé (${this.acceptedTypes})`);
        continue;
      }


      // Créer l'objet FileUpload
      const fileUpload: FileUploadInterface = {
        file,
        progress: 0,
        status: 'pending'
      };

      // Créer la prévisualisation pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileUpload.preview = e.target?.result as string;
          this.files.update(files => [...files]);
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(fileUpload);
    }

    if (validFiles.length > 0) {
      this.files.update(files => [...files, ...validFiles]);
      this.filesSelected.emit(validFiles.map(f => f.file));
      this.simulateUpload(validFiles);
    }
  }

  private simulateUpload(filesToUpload: FileUploadInterface[]): void {
    this.isUploading.set(true);

    filesToUpload.forEach((fileUpload, index) => {
      fileUpload.status = 'uploading';
      
      const interval = setInterval(() => {
        if (fileUpload.progress < 100) {
          fileUpload.progress += Math.random() * 30;
          if (fileUpload.progress > 100) fileUpload.progress = 100;
          this.files.update(files => [...files]);
        } else {
          clearInterval(interval);
          fileUpload.status = 'success';
          this.files.update(files => [...files]);
          
          // Vérifier si tous les fichiers sont uploadés
          const allComplete = this.files().every(f => f.status === 'success' || f.status === 'error');
          if (allComplete) {
            this.isUploading.set(false);
            this.uploadComplete.emit(this.files());
          }
        }
      }, 200);
    });
  }

  removeFile(fileToRemove: FileUploadInterface): void {
    this.files.update(files => files.filter(f => f !== fileToRemove));
    this.fileRemoved.emit(fileToRemove.file);
  }

  clearAll(): void {
    this.files.set([]);
    this.errorMessage.set('');
  }

  getFileIcon(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (file.type.startsWith('image/')) return 'fa-file-image';
    if (ext === 'pdf') return 'fa-file-pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'fa-file-word';
    if (['xls', 'xlsx'].includes(ext || '')) return 'fa-file-excel';
    if (['zip', 'rar'].includes(ext || '')) return 'fa-file-zipper';
    
    return 'fa-file';
  }

  getFileIconColor(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (file.type.startsWith('image/')) return 'text-info';
    if (ext === 'pdf') return 'text-danger';
    if (['doc', 'docx'].includes(ext || '')) return 'text-primary';
    if (['xls', 'xlsx'].includes(ext || '')) return 'text-success';
    
    return 'text-secondary';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]; 
  }

  private isFileTypeAllowed(file: File): boolean {
    const accepted = this.acceptedTypes
      .split(',')
      .map(t => t.trim().toLowerCase());

    const fileName = file.name.toLowerCase();
    const fileExt = '.' + fileName.split('.').pop();
    const mime = file.type.toLowerCase();

    // Vérification par extension explicite (.pdf, .doc...)
    if (accepted.includes(fileExt)) return true;

    // Vérification par MIME direct (image/png)
    if (accepted.includes(mime)) return true;

    // Vérification pattern image/*, video/* etc.
    const mimeGroup = mime.split('/')[0] + '/*';
    if (accepted.includes(mimeGroup)) return true;

    return false;
  }


}
