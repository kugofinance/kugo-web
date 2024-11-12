const Strategy = ({ address }) => {
  return (
    <div>
      <Heading size="4">Strategy Settings</Heading>
      <StrategySettings />
      <RiskParameters />
      <NotificationPreferences />
    </div>
  );
};
