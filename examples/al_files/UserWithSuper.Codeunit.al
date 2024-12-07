namespace STM.BusinessCentral.Sentinel;

using STM.BusinessCentral.Sentinel;
using System.Security.AccessControl;
using System.Security.User;

codeunit 71180280 UserWithSuperSESTM implements IAuditAlertSESTM
{
    Access = Internal;
    Permissions =
        tabledata "Access Control" = R,
        tabledata AlertSESTM = RI;

    procedure CreateAlerts()
    var
        AccessControl: Record "Access Control";
        Alert: Record AlertSESTM;
        User: Record User;
        ActionRecommendationLbl: Label 'Reduce the permissions of the user %1 in the company %2 if possible.', Comment = '%1 = User Name, %2 = Company Name';
        LongDescLbl: Label 'The user %1 has SUPER permissions in the company %2. This is a security risk and should be reviewed.', Comment = '%1 = User Name, %2 = Company Name';
        ShortDescLbl: Label 'User "%1: has SUPER permissions in Company %2', Comment = '%1 = User Name, %2 = Company Name';
    begin
        User.SetFilter("License Type", '<>External User&<>Application&<>AAD Group');
        User.ReadIsolation(IsolationLevel::ReadUncommitted);
        User.SetLoadFields("User Security ID", "User Name");
        if User.FindSet() then
            repeat
                AccessControl.SetRange("User Security ID", User."User Security ID");
                AccessControl.SetRange("Role ID", 'SUPER');
                AccessControl.ReadIsolation(IsolationLevel::ReadUncommitted);
                AccessControl.SetLoadFields("User Security ID", "Role ID", "Company Name");
                if AccessControl.FindSet() then
                    repeat
                        if AccessControl."Company Name" = '' then
                            AccessControl."Company Name" := '<all>';

                        Alert.New(
                            "AlertCodeSESTM"::"SE-000005",
                            StrSubstNo(ShortDescLbl, User."User Name", AccessControl."Company Name"),
                            SeveritySESTM::Info,
                            AreaSESTM::Permissions,
                            StrSubstNo(LongDescLbl, User."User Name", AccessControl."Company Name"),
                            StrSubstNo(ActionRecommendationLbl, User."User Name", AccessControl."Company Name"),
                            CreateUniqueIdentifier(AccessControl)
                        );
                    until AccessControl.Next() = 0;
            until User.Next() = 0;
    end;

    local procedure CreateUniqueIdentifier(var AccessControl: Record "Access Control"): Text[100]
    begin
        exit(CopyStr(AccessControl."User Security ID" + '/' + AccessControl."Role ID" + '/' + AccessControl."Company Name", 1, 100));
    end;

    procedure ShowMoreDetails(var Alert: Record AlertSESTM)
    var
        WikiLinkTok: Label 'https://github.com/StefanMaron/BusinessCentral.Sentinel/wiki/SE-000005', Locked = true;
    begin
        Hyperlink(WikiLinkTok);
    end;

    procedure ShowRelatedInformation(var Alert: Record AlertSESTM)
    var
        User: Record User;
        OpenPageQst: Label 'Do you want to open the page to manage the user?';
    begin
        if not Confirm(OpenPageQst) then
            exit;

        User.SetRange("User Security ID", Alert."UniqueIdentifier".Split('/').Get(1));
        Page.Run(Page::"User Card", User);
    end;

    procedure AutoFix(var Alert: Record AlertSESTM)
    begin

    end;
}