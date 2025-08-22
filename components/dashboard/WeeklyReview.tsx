import React, { useState, memo } from 'react';
import moment from 'moment';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';
import WeeklyReviewModal from '../WeeklyReviewModal.js';
import { useSounds } from '../../hooks/useSounds.js';

const WeeklyReview: React.FC = () => {
  const { state, t, language } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const play = useSounds();

  const startOfWeek = moment().locale(language).startOf('week').format('YYYY-MM-DD');
  const canGenerateReview = !state.lastWeeklyReviewDate || moment(state.lastWeeklyReviewDate).isBefore(startOfWeek);

  if (!canGenerateReview) {
    return null;
  }
  
  return (
    <>
      <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)] flex flex-col items-center justify-center text-center">
        <Icon name="bar-chart-2" className="w-12 h-12 text-[var(--text-primary)] mb-3" />
        <h3 className="text-xl font-bold text-[var(--text-secondary)]">{t('dashboard.intel_report')}</h3>
        <p className="text-[var(--text-muted)] mt-2 mb-4">
          {t('dashboard.intel_report_desc')}
        </p>
        <button
          onClick={() => {
            play('click');
            setIsModalOpen(true);
          }}
          className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-5 rounded-none transition-all border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
        >
          {t('dashboard.intel_report_cta')}
        </button>
      </div>
      <WeeklyReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default memo(WeeklyReview);