// Types for globally registered components (app.use(Quiet)), so templates type-check <QButton> without imports.
// Add to your tsconfig: "types": ["@frederikhd/quiet/global"].
import type * as Q from './components';

declare module 'vue' {
  export interface GlobalComponents {
    QAddressFields: typeof Q.QAddressFields;
    QAppShell: typeof Q.QAppShell;
    QBadge: typeof Q.QBadge;
    QBreadcrumbs: typeof Q.QBreadcrumbs;
    QButton: typeof Q.QButton;
    QCard: typeof Q.QCard;
    QCheckbox: typeof Q.QCheckbox;
    QCheckboxGroup: typeof Q.QCheckboxGroup;
    QCombobox: typeof Q.QCombobox;
    QDescriptionList: typeof Q.QDescriptionList;
    QDialog: typeof Q.QDialog;
    QDisclosure: typeof Q.QDisclosure;
    QDiscountCode: typeof Q.QDiscountCode;
    QEmptyState: typeof Q.QEmptyState;
    QField: typeof Q.QField;
    QFieldGroup: typeof Q.QFieldGroup;
    QFileUpload: typeof Q.QFileUpload;
    QFilterChips: typeof Q.QFilterChips;
    QForm: typeof Q.QForm;
    QFormActions: typeof Q.QFormActions;
    QFormSection: typeof Q.QFormSection;
    QGallery: typeof Q.QGallery;
    QIcon: typeof Q.QIcon;
    QInput: typeof Q.QInput;
    QMenu: typeof Q.QMenu;
    QMetric: typeof Q.QMetric;
    QNav: typeof Q.QNav;
    QNotice: typeof Q.QNotice;
    QOrderSummary: typeof Q.QOrderSummary;
    QPage: typeof Q.QPage;
    QPageColumns: typeof Q.QPageColumns;
    QPagination: typeof Q.QPagination;
    QPopover: typeof Q.QPopover;
    QPrice: typeof Q.QPrice;
    QPriceRange: typeof Q.QPriceRange;
    QProductCard: typeof Q.QProductCard;
    QQuantityStepper: typeof Q.QQuantityStepper;
    QRadio: typeof Q.QRadio;
    QRadioGroup: typeof Q.QRadioGroup;
    QRating: typeof Q.QRating;
    QRatingInput: typeof Q.QRatingInput;
    QReviewSummary: typeof Q.QReviewSummary;
    QSearchBox: typeof Q.QSearchBox;
    QSelect: typeof Q.QSelect;
    QSteps: typeof Q.QSteps;
    QTable: typeof Q.QTable;
    QTabs: typeof Q.QTabs;
    QTag: typeof Q.QTag;
    QTextarea: typeof Q.QTextarea;
    QToaster: typeof Q.QToaster;
  }
}

export {};
