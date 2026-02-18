import React, { ReactNode, ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <AlertCircle className="text-red-600" size={48} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 text-center mb-4">
              Aplikasi mengalami masalah yang tidak terduga. Silakan coba refresh halaman.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-red-700 break-words">
                {this.state.error?.message || 'Kesalahan tidak diketahui'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
