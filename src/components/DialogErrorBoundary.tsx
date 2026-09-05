'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClose: () => void;
  label?: string;
}
interface State {
  failed: boolean;
  attempt: number;
}

export class DialogErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, attempt: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true };
  }

  retry = () => this.setState((s) => ({ failed: false, attempt: s.attempt + 1 }));

  render() {
    if (!this.state.failed) return <span key={this.state.attempt}>{this.props.children}</span>;
    return (
      <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b0f17]/90 p-5">
        <div className="w-full max-w-sm rounded-[12px] border border-white/[0.08] bg-[#111622] p-6 text-center">
          <p className="text-[16px] font-semibold text-[#f2f4f8]">Could not open this {this.props.label ?? 'item'}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#a4adbe]">The page may have been updated while you were reading. Try again, or reload the page.</p>
          <div className="mt-5 flex justify-center gap-3">
            <button type="button" onClick={this.retry} className="inline-flex h-11 items-center rounded-full bg-[#0066ff] px-5 text-[14px] font-medium text-white">Try again</button>
            <button type="button" onClick={this.props.onClose} className="inline-flex h-11 items-center rounded-full border border-white/[0.12] px-5 text-[14px] font-medium text-[#f2f4f8]">Close</button>
          </div>
        </div>
      </div>
    );
  }
}
