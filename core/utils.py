from datetime import datetime


def get_quarter_from_date_range(date_to, date_from=None):
    result = []
    if date_from is None:
        date_from = datetime.now()
    quarter_to = (date_to.month/4)+1
    for year in range(date_from.year, date_to.year+1):
        for quarter in range(1, 5):
            if date_from.year == year and quarter <= quarter_to:
                continue
            if date_to.year == year and quarter > quarter_to:
                break
            result.append([quarter, year])
    return result

