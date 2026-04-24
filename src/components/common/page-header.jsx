const PageHeader = ({
  icon: IconComponent,
  title = "Page Title",
  description = "",
  rightContent = null,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl  p-4 mb-2 border  shadow-sm">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/2 w-60 h-60 bg-white/20 rounded-full blur-3xl -ml-30 -mb-20" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="p-3.5 rounded-xl bg-accent/20 flex-shrink-0 shadow-sm border">
            <IconComponent className="w-6 h-6 text-accent" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
